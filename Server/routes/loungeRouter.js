const express = require("express");
const loungeRouter = express.Router();
const {
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
} = require("../middlewares/auth.middleware");
const Lounges = require("../models/lounge.model");
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
		verifyAdmin,
		upload.single("image"),
		loungeController.createLounge
	)
	.put(verifyToken, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /lounges");
		next();
	})
	.delete(verifyToken, verifyAdmin, loungeController.deleteManyLounge);

loungeRouter
	.route("/:id")
	.get(loungeController.getLounge)
	.post(verifyToken, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send("POST operation not supported on /lounges/" + req.params.id);
	})
	.put(verifyLoungeAdmin, verifyLoungeAdmin, loungeController.updateLounge)
	.delete(verifyAdmin, loungeController.deleteLounge);

loungeRouter
	.route("/admin/lounge")
	.get(verifyToken, verifyLoungeAdmin, loungeController.getLoungesByAdmin);

module.exports = loungeRouter;
