const express = require("express");
const Dishes = require("../models/dishes");
const Lounges = require("../models/lounge.model");
const { cloudinaryUploader } = require("../middlewares/fileUploader");
const fs = require("fs");

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
	console.log(req.headers);
	Dishes.find({})
		.populate("lounge")
		.populate("lounge.loungeAdmin")
		.populate("comment.author")
		.then((dishes) => {
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(dishes);
			next();
		})
		.catch((err) => next(err));
};

const getDishesByLounge = async (req, res, next) => {
	Dishes.find({ lounge: req.params.loungeId })
		.populate("lounge")
		.then((dishes) => {
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(dishes);
			// next();
		})
		.catch((err) => next(err));
};

const createDish = async (req, res, next) => {
	// TODO: Add lounge id to the dish
	const lounge = await Lounges.findOne({ name: req.body.lounge });
	req.body.lounge = lounge?._id;

	Dishes.create({
		image: "C:/Projects/Gebeta/Server/" + req?.file?.path,
		...req.body,
	})
		.then(async (dish) => {
			if (req?.file) {
				const upload_data = await Uploader(
					"C:/Projects/Gebeta/Server/" + req?.file?.path
				);
				dish.image = upload_data.secure_url;
				await dish.save();
			}

			res.statusCode = 200;
			res.contentType("application/json");
			res.json(dish);
			next();
		})
		.catch((err) => next(err));
};

const updateDish = async (req, res, next) => {
	// TODO: lounge id to the dish
	const lounge = await Lounges.findOne({ name: req.body.lounge });
	const dish = await Dishes.findOne({ _id: req.params.dishid });
	req.body.lounge = lounge?._id;
	if (req?.file?.path) {
		req.body.image = "C:/Projects/Gebeta/Server/" + req?.file?.path;
		fs.unlink(
			__dirname + "/../uploads/loungeImages/" + dish.image.split("\\").pop(),
			(err) => {
				if (err) {
					return next(err);
				}
			}
		);
	} else {
		req.body.image = dish.image;
	}

	Dishes.findOneAndUpdate(
		{ _id: req.params.dishid },
		{
			$set: req.body,
		},
		{
			returnDocument: "after",
		}
	)
		.then((newDishes) => {
			res.statusCode = 200;
			res.contentType("application/json");
			res.json(newDishes);
		})
		.catch((err) => next(err));
};

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
