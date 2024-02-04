const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dishes").default;
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
	verifyToken,
} = require("../middlewares/auth.middleware");
const Orders = require("../models/orders");
const Lounges = require("../models/lounges");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const {
	cloudinary,
	cloudinaryUploader,
	upload,
} = require("../middlewares/fileUploader");
const dishController = require("../controllers/dish.controller");

dishRouter.use(bodyParser.json());

dishRouter
	.route("/")
	.get(dishController.getAllDishes)
	.post(
		verifyToken,
		isAuthenticated,
		// verifyLoungeAdmin,
		upload.single("image"),
		dishController.createDish
	)
	.put(verifyToken, isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
		next();
	})
	.delete(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		dishController.deleteManyDish
	);

// dishRouter.route("/:loungeId").get(dishController.getDishesByLounge);

dishRouter
	.route("/:dishid")
	.get(dishController.getDish)
	.post(verifyToken, isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /dishes/${req.params.dishid}`);
		next();
	})
	.put(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		dishController.updateDish
	)
	.delete(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		dishController.deleteDish
	);

dishRouter
	.route("/:dishId/comments")
	.get(verifyToken, isAuthenticated, dishController.getDishComments)
	.post(verifyToken, isAuthenticated, dishController.createDishComment);

dishRouter
	.route("/:dishId/comments/:commentId")
	.put(verifyToken, isAuthenticated, dishController.updateDishComment);

dishRouter
	.route("/comments/all")
	.get(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		dishController.getAllComments
	);

dishRouter.route("/distinct").get((req, res, next) => {
	Dishes.distinct(req?.body?.field, req.body.filter)
		.then((data) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(data);
			next();
		})
		.catch((err) => {
			next(err);
		});
});
module.exports = dishRouter;
