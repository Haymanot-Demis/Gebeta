require("dotenv").config();
const Users = require("../models/users");
const roleController = require("../controllers/role.controller");

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const httpStatus = require("http-status");

const verifyToken = async (req, res, next) => {
	// get token from header
	const bearerHeader = req.headers["authorization"];
	// check if bearer is undefined
	if (typeof bearerHeader !== "undefined") {
		// split at the space
		const bearer = bearerHeader.split(" ");
		// get token from array
		const bearerToken = bearer[1];
		// set the token
		req.token = bearerToken;
		// next middleware
		try {
			console.log(process.env.SECRETE);
			const decoded = jwt.verify(req.token, process.env.SECRETE);
			req.user = decoded;
			next();
		} catch (err) {
			res.statusCode = 403;
			res.contentType = "application/json";
			next(err);
		}
	} else {
		// forbidden
		res.statusCode = 403;
		res.contentType = "application/json";
		const err = ApiError(httpStatus.UNAUTHORIZED, "Forbidden");
		next(err);
	}
};

const verifyAdmin = (req, res, next) => {
	return next();
	const err = new Error("Unauthorized Access");
	res.statusCode = 403;
	res.contentType = "application/json";
	next(err);
};

const isAccountActive = (req, res, next) => {
	if (!req?.user?.isactivated) {
		res.statusCode = 200;
		res.send(
			"This account is not ready for use. Please wait until it is activated"
		);
	}
	next();
};

const verifyLoungeAdmin = (req, res, next) => {
	if (req?.user?.role?.indexOf("loungeadmin") == -1) {
		const err = new Error("Unauthorized Access");
		res.statusCode = 403;
		res.contentType = "application/json";
		return next(err);
	}
	next();
};

const isAuthenticated = (req, res, next) => {
	console.log(req.user);
	next();
};

module.exports = {
	verifyToken,
	isAuthenticated,
	verifyAdmin,
	verifyLoungeAdmin,
};
