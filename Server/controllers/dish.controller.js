const express = require("express");
const Dishes = require("../models/dish.model");
const Lounges = require("../models/lounge.model");
const { cloudinaryUploader, upload } = require("../middlewares/fileUploader");
const dishServices = require("../services/dish.services");
const loungeService = require("../services/lounge.services");
const fs = require("fs");
const { isFound } = require("../utils/checks");
const catchAsync = require("../utils/asyncHandler");

const getDish = (req, res, next) => {
	Dishes.findById(req.params.dishid)
		.populate("lounge")
		.populate("lounge.loungeAdmin")
		.populate("comment.author")
		.then((dish) => {
			if (!dish) {
				res.statusCode = 404;
				res.contentType("text/plain");
				res.send("Dish with id" + req.params.dishid + " is not found");
				return next();
			}
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(dish);
		})
		.catch((err) => next(err));
};
const getAllDishes = async (req, res, next) => {
	const dishes = await dishServices.getAllDishes();
	res.statusCode = 200;
	res.contentType("application/json");
	res.json(dishes);
	next();
};

const getDishesByLounge = catchAsync(async (req, res, next) => {
	const dishes = await dishServices.getDishes({ lounge: req.user.userId });
	res.statusCode = 200;
	res.contentType("application/json");
	res.json(dishes);
});

const createDish = catchAsync(async (req, res, next) => {
	// TODO: Add lounge id to the dish
	const isExist = await loungeService.exists({
		_id: req.body?.lounge,
		loungeAdmin: req.user.userId,
	});

	isFound(isExist, `Lounge with id ${req.body?.lounge} is not`);

	if (req?.file) {
		console.log("file uploading");
		const upload_data = await cloudinaryUploader(req.file.path);
		req.body.image = upload_data.secure_url;
	}
	console.log("create controller", req.body);
	const dish = await dishServices.createDish(req.body);

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(dish);
	next();
});

const updateDish = catchAsync(async (req, res, next) => {
	// TODO: lounge id to the dish
	const lounge = await loungeService.getLoungeByAdmin(req.user.userId);
	console.log(lounge);
	const dish = await dishServices.exists({
		_id: req.params.dishId,
		lounge: lounge._id,
	});
	console.log(dish);
	isFound(dish);

	if (req?.file?.path) {
		const uploadResult = await cloudinaryUploader(req.file.path);
		req.body.image = uploadResult.secure_url;
	}

	const newDish = dishServices.updateDish(req.params.dishId, req.body);

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(newDish);
});
// delete dishes belonging to a lounge
const deleteManyDish = async (req, res, next) => {
	const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
	Dishes.deleteMany({ lounge: lounge._id })
		.then((result) => {
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(result);
			next();
		})
		.catch((err) => next(err));
};

const deleteDish = async (req, res, next) => {
	const dish = await Dishes.findOne({ _id: req.params.dishid });
	fs.access(
		__dirname + "/../uploads/loungeImages/" + dish.image.split("\\").pop(),
		(error) => {
			if (!error) {
				fs.unlink(
					__dirname +
						"/../uploads/loungeImages/" +
						dish.image.split("\\").pop(),
					(err) => {
						if (err) {
							next(err);
						}
						console.log("deleted");
					}
				);
			}
		}
	);

	Dishes.deleteOne({ _id: req.params.dishid })
		.then((dishes) => {
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(dishes);
		})
		.catch((err) => next(err));
};

// TODO: select only the comment attribute of the dish
const getDishComments = (req, res, next) => {
	Dishes.findById(req.params.dishId)
		.populate("comment.author")
		.then((dish) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(dish.comment);
		});
};

// TODO: add validation on comment object
const createDishComment = (req, res, next) => {
	Dishes.findById(req.params.dishId)
		.then(async (dish) => {
			if (!dish) {
				res.statusCode = 404;
				res.contentType = "text/plain";
				res.send("Dish with id" + req.params.dishId + " is not found");
				return next();
			}

			dish.comment.push({ ...req.body });
			await dish.save();
			res.send("comment saved");
		})
		.catch((err) => {
			next(err);
		});
};

const updateDishComment = (req, res, next) => {
	Dishes.findById(req.params.dishId).then((dish) => {
		if (!dish) {
			res.statusCode = 404;
			res.contentType = "application/json";
			res.json({
				msg: "Dishes with dish id " + req.params.dishId + " is not found",
			});
			return next(
				new Error("Dish with dish id " + req.params.dishId + "is not found")
			);
		}
		dish.comment.forEach((comment) => {
			if (comment._id.toString() === req.params.commentId) {
				comment.read = true;
				dish.save().then((result) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(result);
					next();
				});
			}
		});
	});
};

// return all comments of all dishes of a lounge
const getAllComments = async (req, res, next) => {
	let lounge = await Lounges.findOne({
		loungeAdmin: req.user._id,
	});
	Dishes.find({ lounge: lounge._id }, { comments: "1" })
		.sort({ createdAt: 1 })
		.populate("comment.author")
		.then((dishes) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			var com = [];
			dishes.forEach((dish) => {
				com.push(...dish.comment);
			});
			res.json(com);
			next();
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getDish,
	getAllDishes,
	getDishesByLounge,
	createDish,
	deleteManyDish,
	deleteDish,
	updateDish,
	getDishComments,
	createDishComment,
	updateDishComment,
	getAllComments,
};
