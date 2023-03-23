const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
} = require("../authenticate/authenticate");
const Orders = require("../models/orders");
const multer = require("multer");
const crypto = require("crypto");
const Lounges = require("../models/lounges");
const { ObjectId } = require("mongodb");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/loungeImages");
	},
	filename: (req, file, cb) => {
		const extname = file.originalname.split(".")[1];
		const filename =
			file.originalname.split(".")[0] + crypto.randomBytes(5).toString("hex");
		console.log(extname, filename);
		cb(null, filename + "." + extname);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		console.log("filename", file);
		if (!file.originalname) {
			console.log("no file is uploaded");
			return cb(new Error("no file is uploaded"));
		}
		console.log(file.originalname.match(/\.(jpg|jpeg|png|gif|gfif)$/));
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/)) {
			console.log("Image file format must be .jpg . jpeg .gif .png");
			return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
		}
		return cb(null, true);
	},
});

dishRouter.use(bodyParser.json());

dishRouter
	.route("/")
	.get(async (req, res, next) => {
		// console.log(req?.body?.options);
		let options;
		if (req?.user?.loungeAdmin) {
			const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
			options = { ...req.body.options, lounge: lounge._id };
		}
		Dishes.find(options)
			.populate("lounge")
			.populate("lounge.loungeAdmin")
			.populate("comment.author")
			.then((dishes) => {
				res.statusCode = 200;
				res.contentType("application/json");
				// console.log(dishes);
				res.json(dishes);
				next();
			})
			.catch((err) => next(err));
	})
	.post(
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		async (req, res, next) => {
			console.log("http://127.0.0.1:5500/Server" + req?.file?.path);
			// const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
			const lounge = await Lounges.findOne({ name: req.body.lounge });
			req.body.lounge = lounge?._id;
			Dishes.create({
				image: "http://127.0.0.1:5500/Server/" + req?.file?.path,
				...req.body,
			})
				.then((dishes) => {
					res.statusCode = 200;
					res.contentType("application/json");
					res.json(dishes);
					next();
				})
				.catch((err) => next(err));
		}
	)
	.put(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
		next();
	})
	.delete(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
		// lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
		// Dishes.deleteMany({ lounge: lounge._id })
		Dishes.deleteMany({})
			.then((result) => {
				res.statusCode = 200;
				res.contentType("application/json");
				res.json(result);
				next();
			})
			.catch((err) => next(err));
	});

dishRouter.route("/option/:option").get(async (req, res, next) => {
	console.log(req.params.option);
	res.end();
});

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
	.post(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /dishes ${req.params.dishid}`);
		next();
	})
	.put(
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		async (req, res, next) => {
			// const lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
			console.log("put");
			console.log(req.body);
			console.log(req.file);
			const lounge = await Lounges.findOne({ name: req.body.lounge });
			const dish = await Dishes.findOne({ _id: req.params.dishid });
			console.log(dish);
			console.log(lounge);
			req.body.lounge = lounge?._id;
			if (req?.file?.path) {
				req.body.image = "http://127.0.0.1:5500/Server/" + req?.file?.path;
			} else {
				req.body.image = dish.image;
			}
			Dishes.findOneAndUpdate(
				// { lounge: lounge?._id, _id: req.params.dishid },
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
	.delete(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		// Dishes.deleteOne({ loungeAdmin: req.user._id, _id: req.params.dishid }) later
		Dishes.deleteOne({ _id: req.params.dishid })
			.then((dishes) => {
				res.statusCode = 200;
				res.contentType("application/json");
				res.json(dishes);
			})
			.catch((err) => next(err));
	});

dishRouter.route("/lounge/:loungeId").get((req, res, next) => {
	console.log(typeof req.params.loungeId);
	Lounges.findById(req.params.loungeId).then((lounge) => {
		Dishes.findOne({})
			.then((dishes) => {
				res.statusCode = 200;
				res.contentType("application/json");
				console.log(dishes?.lounge);
				res.json(dishes);
				next();
			})
			.catch((err) => next(err));
	});
});

dishRouter
	.route("/:dishId/comments")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.populate("comment.author")
			.then((dish) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(dish.comment);
			});
	})
	.post((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(async (dish) => {
				if (!dish) {
					res.statusCode = 404;
					res.contentType = "text/plain";
					res.send("Dish with id" + req.params.dishId + " is not found");
					return next();
				}
				// req.body.comment.author = req.user._id
				// req.body.lounge = lounge._id
				dish.comment.push({ ...req.body });
				await dish.save();
				res.send("comment saved");
			})
			.catch((err) => {
				next(err);
			});
	});

dishRouter
	.route("/comments/all")
	.get(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
		// let lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
		// Dishes.find({ lounge: lounge._id }, { comments: "1" })
		Dishes.find({}, { comment: "1" })
			.sort({ createdAt: 1 })
			.populate("comment.author")
			.populate("comment.lounge")
			.then((comments) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				var com = [];
				comments.forEach((comment) => {
					com.push(...comment.comment);
				});
				console.log(com);
				res.json(com);
				next();
			})
			.catch((err) => {
				next(err);
			});
	});

module.exports = dishRouter;
