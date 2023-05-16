const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
	verifyToken,
} = require("../authenticate/authenticate");
const Orders = require("../models/orders");
const Lounges = require("../models/lounges");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const { cloudinary, Uploader, upload } = require("../controllers/uploader");

dishRouter.use(bodyParser.json());

dishRouter
	.route("/")
	.get(async (req, res, next) => {
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
	})
	.post(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		async (req, res, next) => {
			const lounge = await Lounges.findOne({ name: req.body.lounge });
			req.body.lounge = lounge?._id;

			Dishes.create({
				image: "C:/Projects/Gebeta/Server/" + req?.file?.path,
				...req.body,
			})
				.then(async (dish) => {
					const upload_data = await Uploader(
						"C:/Projects/Gebeta/Server/" + req?.file?.path
					);
					dish.image = upload_data.secure_url;
					await dish.save();
					res.statusCode = 200;
					res.contentType("application/json");
					res.json(dish);
					next();
				})
				.catch((err) => next(err));
		}
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
		async (req, res, next) => {
			const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
			Dishes.deleteMany({ lounge: lounge._id })
				.then((result) => {
					res.statusCode = 200;
					res.contentType("application/json");
					res.json(result);
					next();
				})
				.catch((err) => next(err));
		}
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

dishRouter
	.route("/:dishid")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishid)
			.populate("lounge")
			.populate("lounge.loungeAdmin")
			.populate("comment.author")
			.then((dishes) => {
				res.statusCode = 200;
				res.contentType("application/json");
				// console.log(dishes);
				res.json(dishes);
			})
			.catch((err) => next(err));
	})
	.post(verifyToken, isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /dishes ${req.params.dishid}`);
		next();
	})
	.put(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		async (req, res, next) => {
			// const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
			const lounge = await Lounges.findOne({ name: req.body.lounge });
			const dish = await Dishes.findOne({ _id: req.params.dishid });
			req.body.lounge = lounge?._id;
			if (req?.file?.path) {
				req.body.image = "C:/Projects/Gebeta/Server/" + req?.file?.path;
				fs.unlink(
					__dirname +
						"/../uploads/loungeImages/" +
						dish.image.split("\\").pop(),
					(err) => {
						if (err) {
							console.log(err);
							return next(err);
						}
						console.log("deleted");
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
		}
	)
	.delete(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		async (req, res, next) => {
			const dish = await Dishes.findOne({ _id: req.params.dishid });
			fs.unlink(
				__dirname + "/../uploads/loungeImages/" + dish.image.split("\\").pop(),
				(err) => {
					if (err) {
						console.log(err);
						next(err);
					}
					console.log("deleted");
				}
			);
			Dishes.deleteOne({ _id: req.params.dishid })
				.then((dishes) => {
					res.statusCode = 200;
					res.contentType("application/json");
					res.json(dishes);
				})
				.catch((err) => next(err));
		}
	);

dishRouter
	.route("/:dishId/comments")
	.get(verifyToken, isAuthenticated, (req, res, next) => {
		Dishes.findById(req.params.dishId)
			.populate("comment.author")
			.then((dish) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(dish.comment);
			});
	})
	.post(verifyToken, isAuthenticated, (req, res, next) => {
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
	});

dishRouter
	.route("/:dishId/comments/:commentId")
	.put(verifyToken, isAuthenticated, (req, res, next) => {
		Dishes.findById(req.params.dishId).then((dish) => {
			if (!dish) {
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({
					msg:
						"Dishes comment with dish id " +
						req.params.dishId +
						" is not found",
				});
				return next(
					new Error(
						"Dishes Comment with dish id " + req.params.dishId + "is not found"
					)
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
	});

dishRouter
	.route("/comments/all")
	.get(
		verifyToken,
		isAuthenticated,
		verifyLoungeAdmin,
		async (req, res, next) => {
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
		}
	);

module.exports = dishRouter;
