const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dishes").default;
const bodyParser = require("body-parser");
const {
	verifyAdmin,
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
		verifyLoungeAdmin,
		upload.single("image"),
		dishController.createDish
	)
	.put(verifyToken, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
		next();
	})
	.delete(verifyToken, verifyLoungeAdmin, dishController.deleteManyDish);

// dishRouter.route("/:loungeId").get(dishController.getDishesByLounge);

dishRouter
	.route("/:dishid")
	.get(dishController.getDish)
	.post(verifyToken, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /dishes/${req.params.dishid}`);
		next();
	})
	.put(
		verifyToken,
		verifyLoungeAdmin,
		upload.single("image"),
		dishController.updateDish
	)
	.delete(verifyToken, verifyLoungeAdmin, dishController.deleteDish);

dishRouter
	.route("/:dishId/comments")
	.get(verifyToken, dishController.getDishComments)
	.post(verifyToken, dishController.createDishComment);

dishRouter
	.route("/:dishId/comments/:commentId")
	.put(verifyToken, dishController.updateDishComment);

dishRouter
	.route("/comments/all")
	.get(verifyToken, verifyLoungeAdmin, dishController.getAllComments);

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
