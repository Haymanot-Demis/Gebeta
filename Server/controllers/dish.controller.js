const Dishes = require("../models/dish.model");
const Lounges = require("../models/lounge.model");
const { cloudinaryUploader, upload } = require("../middlewares/fileUploader");
const dishServices = require("../services/dish.services");
const loungeService = require("../services/lounge.services");
const fs = require("fs");
const { isFound } = require("../utils/checks");
const catchAsync = require("../utils/asyncHandler");
const configs = require("../config/configs");
const { paginationParams, paginatedResponse } = require("../utils/pagination");
const { removeImage } = require("../utils/file");

const getDish = catchAsync(async (req, res, next) => {
	const dish = await dishServices.getDish(req.params.dishId);

	isFound(dish, `Dish with id ${req.params.dishid} is `);

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(dish);
});
const getAllDishes = catchAsync(async (req, res, next) => {
	const [page, offset, limit] = paginationParams(req);
	const dishes = await dishServices.getAllDishes(offset, limit);
	const total = await dishServices.count({});
	res.statusCode = 200;
	res.contentType("application/json");
	res.json(new paginatedResponse(dishes, page, limit, total));
	next();
});

const getDishesByLounge = catchAsync(async (req, res, next) => {
	const [page, offset, limit] = paginationParams(req);
	const dishes = await dishServices.getDishes(
		{ lounge: req.params.loungeId },
		offset,
		limit
	);
	const total = await dishServices.count({ lounge: req.params.loungeId });

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(new paginatedResponse(dishes, page, limit, total));
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
	isFound(dish, `Dish with id ${req.params.dishId} is `);

	if (req?.file?.path) {
		const uploadResult = await cloudinaryUploader(req.file.path);
		req.body.image = uploadResult.secure_url;
	}

	const newDish = await dishServices.updateDish(req.params.dishId, req.body);

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(newDish);
});
// delete all dishes belonging to a lounge
const deleteManyDish = catchAsync(async (req, res, next) => {
	const lounge = await loungeService.getLoungeByAdmin(req.user.userId);

	isFound(lounge, `Lounge is `);

	const result = dishServices.deleteManyDish({
		lounge: lounge._id,
		...req.query,
	});

	res.statusCode = 200;
	res.contentType("application/json");
	res.json(result);
	next();
});

const deleteDish = catchAsync(async (req, res, next) => {
	const dish = await dishServices.getDish(req.params.dishId);

	isFound(dish, `Dish with id ${req.params.dishId} is `);

	if (dish.image) {
		await removeImage(dish.image);
	}

	const result = await dishServices.deleteDish(dish._id);
	res.statusCode = 200;
	res.contentType("application/json");
	res.json(result);
});

// TODO: Comment part isn't done totally
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
		loungeAdmin: req.user.userId,
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
