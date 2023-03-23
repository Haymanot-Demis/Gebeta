const express = require("express");
const loungeRouter = express.Router();
const {
	verifyAdmin,
	isAuthenticated,
	verifyLoungeAdmin,
} = require("../authenticate/authenticate");
const Lounges = require("../models/lounges");
const multer = require("multer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const Gallery = require("../models/gallery");

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
		console.log(file.originalname.match(/\.(jpg|jpeg|png|gif)$/));
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			console.log("Image file format must be .jpg . jpeg .gif .png");
			return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
		}
		return cb(null, true);
	},
});

loungeRouter.use(bodyParser.json());
loungeRouter.use(bodyParser.urlencoded({ extended: false }));

loungeRouter
	.route("/")
	.get((req, res, next) => {
		let options = {};
		if (req?.user?.loungeAdmin) {
			options = {
				loungeAdmin: req.user._id,
			};
		}
		options = { ...options, ...req.body };
		// console.log(req.body);
		Lounges.find(options)
			.populate("loungeAdmin")
			.then((lounges) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(lounges);
			})
			.catch((err) => next(err));
	})
	.post(
		isAuthenticated,
		verifyLoungeAdmin,
		upload.single("image"),
		(req, res, next) => {
			// console.log(req?.file);
			req.body.loungeAdmin = req.user._id;
			Lounges.create({ image: req?.file?.filename, ...req.body })
				.then(
					(lounges) => {
						res.statusCode = 200;
						res.contentType = "application/json";
						res.json(lounges);
					},
					(err) => {
						console.log("err msg ", err.message);
					}
				)
				.catch((err) => {
					console.log("here", err.message);
					next(err);
				});
		}
	)
	.put(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /dishes");
		next();
	})
	.delete(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		Lounges.deleteMany({ loungeAdmin: req.user._id })
			.then((result) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(result);
			})
			.catch((err) => next(err));
	});

// loungeRouter.route("/gallery/:loungeId").get((req, res, next) => {
//   Gallery.find({ object: req.params.loungeId })
//     .populate("object")
//     .then((images) => {
//       res.statusCode = 200;
//       res.contentType = "application/json";
//       res.json(images);
//       next();
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

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
	.post(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send("POST operation not supported on /lounges/" + req.params.id);
	})
	.put(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
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
	})
	.delete(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
		Lounges.deleteOne({ loungeAdmin: req.user._id, _id: req.params.id })
			.then((result) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(result);
			})
			.catch((err) => next(err));
	});

module.exports = loungeRouter;
