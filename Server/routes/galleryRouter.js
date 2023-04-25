const galleryRouter = require("express").Router();
const { DishesGallery, LoungesGallery } = require("../models/gallery");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
galleryRouter.use(bodyParser.json());
galleryRouter.use(bodyParser.urlencoded({ extended: true }));

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

galleryRouter
	.route("/dishes/:Id")
	.get((req, res, next) => {
		DishesGallery.find({ object: req.params.Id })
			.populate("object")
			.then((images) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(images);
				next();
			})
			.catch((err) => {
				next(err);
			});
	})
	.post(upload.array("images"), (req, res, next) => {
		const data = [];
		req.files.forEach((file) => {
			console.log(file.path);
			data.push({
				object: req.params.Id,
				image: "http://127.0.0.1:5500/Server/" + file.path,
				priorityNumber: req.body.priorityNumber ?? 1,
			});
		});
		console.log(data);
		DishesGallery.create(data)
			.then((images) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(images);
				next();
			})
			.catch((err) => {
				next(err);
			});
	})
	.put(upload.single("images"), (req, res, next) => {
		DishesGallery.findById(req.params.Id).then((image) => {
			// console.log(image.image);
			// console.log(image.image.split("/"));
			// console.log(image.image.split("\\"));
			// console.log(__dirname);
			filename = image.image.split("\\").pop();
			fs.unlink(__dirname + "/../uploads/loungeImages/" + filename, (err) => {
				if (err) next(err);
				console.log("deleted");
			});
			DishesGallery.findOneAndUpdate(
				{ _id: req.params.Id },
				{ $set: { image: "http://127.0.0.1:5500/Server/" + req.file.path } }
			)
				.then((response) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(response);
					next();
				})
				.catch((err) => next(err));
		});
	})
	.delete((req, res, next) => {
		DishesGallery.findById(req.params.Id).then((image) => {
			// console.log(image.image);
			// console.log(image.image.split("/"));
			// console.log(image.image.split("\\"));
			// console.log(__dirname);
			filename = image.image.split("\\").pop();
			fs.unlink(__dirname + "/../uploads/loungeImages/" + filename, (err) => {
				if (err) next(err);
				console.log("deleted");
			});
			DishesGallery.deleteOne({ _id: req.params.Id })
				.then((response) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(response);
					next();
				})
				.catch((err) => next(err));
		});
	});

galleryRouter
	.route("/lounges/:Id")
	.get((req, res, next) => {
		LoungesGallery.find({ object: req.params.Id })
			.populate("object")
			.then((images) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				console.log(images);
				res.json(images);
				next();
			})
			.catch((err) => {
				next(err);
			});
	})
	.post(upload.array("images"), (req, res, next) => {
		const data = [];
		req.files.forEach((file) => {
			console.log(file.path);
			data.push({
				object: req.params.Id,
				image: "http://127.0.0.1:5500/Server/" + file.path,
				priorityNumber: req.body.priorityNumber ?? 1,
			});
		});
		console.log(data);
		LoungesGallery.create(data)
			.then((images) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(images);
				next();
			})
			.catch((err) => {
				next(err);
			});
	})
	.put((req, res, next) => {
		res.send("");
		next();
	})
	.delete((req, res, next) => {
		LoungesGallery.findById(req.params.Id).then((image) => {
			console.log(image.image);
			LoungesGallery.deleteOne({ _id: req.params.Id })
				.then((response) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(response);
					next();
				})
				.catch((err) => next(err));
		});
	});

module.exports = galleryRouter;
