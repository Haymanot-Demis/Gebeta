const express = require("express");
const loungeRouter = express.Router();
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
	verifyToken,
} = require("../authenticate/authenticate");
const Lounges = require("../models/lounges");
const multer = require("multer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const Gallery = require("../models/gallery");
const Dishes = require("../models/dishes");
const { Uploader, upload, cloudinary } = require("../controllers/uploader");

loungeRouter.use(bodyParser.json());
loungeRouter.use(bodyParser.urlencoded({ extended: false }));

loungeRouter
	.route("/")
	.get((req, res, next) => {
		Lounges.find({})
			.populate("loungeAdmin")
			.then((lounges) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(lounges);
			})
			.catch((err) => next(err));
	})
	.post(
		verifyToken,
		isAuthenticated,
		verifyAdmin,
		upload.single("image"),
		(req, res, next) => {
			req.body.loungeAdmin = req.user._id;
			Lounges.create({ image: req?.file?.path, ...req.body })
				.then(
					async (lounge) => {
						const upload_data = await Uploader(lounge.image);
						console.log(upload_data);
						lounge.image = upload_data.secure_url;
						await lounge.save();
						res.statusCode = 200;
						res.contentType = "application/json";
						res.json(lounge);
					},
					(err) => {
						console.log("err msg ", err.message);
						next(err);
					}
				)
				.catch((err) => {
					console.log("here", err.message);
					next(err);
				});
		}
	)
	.put(verifyToken, isAuthenticated, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
		next();
	})
	.delete(verifyToken, isAuthenticated, verifyAdmin, (req, res, next) => {
		Lounges.deleteMany({ loungeAdmin: req.user._id })
			.then((result) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(result);
			})
			.catch((err) => next(err));
	});

loungeRouter
	.route("/:id")
	.get((req, res, next) => {
		Lounges.findById(ObjectId(req.params.id)).then((lounge) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(lounge);
			next();
		});
	})
	.post(verifyToken, isAuthenticated, verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send("POST operation not supported on /lounges/" + req.params.id);
	})
	.put(
		verifyLoungeAdmin,
		isAuthenticated,
		verifyLoungeAdmin,
		(req, res, next) => {
			Lounges.updateMany(
				{
					_id: req.params.id,
					loungeAdmin: req.user._id,
				},
				{
					$set: req.body,
				},
				{ new: true }
			)
				.then((lounge) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(lounge);
				})
				.catch((err) => next(err));
		}
	)
	.delete(isAuthenticated, verifyAdmin, (req, res, next) => {
		Lounges.deleteOne({ loungeAdmin: req.user._id, _id: req.params.id })
			.then((result) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(result);
			})
			.catch((err) => next(err));
	});
loungeRouter
	.route("/admin/lounge")
	.get(verifyToken, isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		Lounges.findOne({ loungeAdmin: req.user._id }).then((lounge) => {
			if (!lounge) {
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({
					status: "failed",
					message: "Lounge with admin id " + req.user._id + " does not exist",
				});
				return next(
					new Error("Lounge with admin id " + req.user._id + " does not exist")
				);
			}
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(lounge);
			next();
		});
	});

loungeRouter
	.route("/:loungeId/dishes")
	.get(verifyToken, isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		Lounges.findById(req.params.loungeId).then((lounge) => {
			Dishes.find({ lounge: lounge._id })
				.populate("lounge")
				.then((dishes) => {
					res.statusCode = 200;
					res.contentType("application/json");
					res.json(dishes);
					next();
				})
				.catch((err) => next(err));
		});
	});

module.exports = loungeRouter;
