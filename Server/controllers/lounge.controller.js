const Lounges = require("../models/lounges");
const { Uploader } = require("./uploader");

const getLounge = (req, res, next) => {
	Lounges.findById(ObjectId(req.params.id)).then((lounge) => {
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json(lounge);
		next();
	});
};

const getLounges = (req, res, next) => {
	Lounges.find({})
		.populate("loungeAdmin")
		.then((lounges) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(lounges);
		})
		.catch((err) => next(err));
};

const createLounge = (req, res, next) => {
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
};

const updateLounge = (req, res, next) => {
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
};

const deleteManyLounge = (req, res, next) => {
	Lounges.deleteMany({ loungeAdmin: req.user._id })
		.then((result) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(result);
		})
		.catch((err) => next(err));
};

const deleteLounge = (req, res, next) => {
	Lounges.deleteOne({ loungeAdmin: req.user._id, _id: req.params.id })
		.then((result) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(result);
		})
		.catch((err) => next(err));
};

const getLoungesByAdmin = (req, res, next) => {
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
};

module.exports = {
	getLounge,
	getLounges,
	createLounge,
	updateLounge,
	deleteLounge,
	deleteManyLounge,
	getLoungesByAdmin,
};
