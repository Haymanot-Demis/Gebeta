const express = require("express");
const loungeRouter = express.Router();
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
	verifyToken,
} = require("../middlewares/auth.middleware");
const Lounges = require("../models/lounges");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const Dishes = require("../models/dishes");
const { Uploader, upload, cloudinary } = require("../middlewares/fileUploader");
const loungeController = require("../controllers/lounge.controller");

loungeRouter.use(bodyParser.json());
loungeRouter.use(bodyParser.urlencoded({ extended: false }));

loungeRouter
	.route("/")
	.get(loungeController.getLounges)
	.post(
		verifyToken,
		isAuthenticated,
		verifyAdmin,
		upload.single("image"),
		loungeController.createLounge
	)
	.put(verifyToken, isAuthenticated, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /lounges");
		next();
	})
	.delete(
		verifyToken,
		isAuthenticated,
		verifyAdmin,
		loungeController.deleteManyLounge
	);

loungeRouter
	.route("/:id")
	.get(loungeController.getLounge)
	.post(verifyToken, isAuthenticated, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send("POST operation not supported on /lounges/" + req.params.id);
	})
	.put(
		verifyLoungeAdmin,
		isAuthenticated,
		verifyLoungeAdmin,
		loungeController.updateLounge
	)
	.delete(isAuthenticated, verifyAdmin, loungeController.deleteLounge);

loungeRouter
	.route("/admin/lounge")
	.get(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		loungeController.getLoungesByAdmin
	);

module.exports = loungeRouter;
