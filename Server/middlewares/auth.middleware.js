require("dotenv").config();
const userService = require("../services/user.services");

const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");
const httpStatus = require("http-status");
const { USER_ROLES } = require("../utils/constants");
const catchAsync = require("../utils/asyncHandler");
const { compareUserId } = require("../utils/auth");

const getTokenFromHeader = (req) => {
	const bearerHeader = req.headers["authorization"];
	// check if bearer is undefined
	if (typeof bearerHeader !== "undefined") {
		// split at the space
		const bearer = bearerHeader.split(" ");
		// get token from array
		const bearerToken = bearer[1];

		if (!bearerToken) {
			const err = ApiError(
				httpStatus.UNAUTHORIZED,
				"token not found in header"
			);
			throw err;
		}
		return bearerToken;
	} else {
		const err = ApiError(httpStatus.UNAUTHORIZED, "token not found in header");
		throw err;
	}
};

const verifyToken = async (req, res, next) => {
	try {
		const token = getTokenFromHeader(req);
		console.log(token, process.env.SECRETE);
		const decoded = jwt.verify(token, process.env.SECRETE);
		req.user = decoded;
		console.log(decoded);
		next();
	} catch (err) {
		res.statusCode = 403;
		res.contentType = "application/json";
		next(err);
	}
};

const verifyAdmin = (req, res, next) => {
	if (!req.user.roles.includes(USER_ROLES.ADMIN)) {
		const err = new Error("Unauthorized Access");
		res.statusCode = 403;
		res.contentType = "application/json";
		next(err);
	}
	next();
};

const verifyLoungeAdmin = (req, res, next) => {
	if (!req.user.roles.includes(USER_ROLES.LOUNGE_ADMIN)) {
		const err = new Error("Unauthorized Access");
		res.statusCode = 403;
		res.contentType = "application/json";
		return next(err);
	}
	next();
};

const verifyPrivacy = (req, res, next) => {
	console.log("verify privacy", req.user.roles);
	if (
		!req.user.roles.includes(USER_ROLES.ADMIN) &&
		!compareUserId(
			req.user.userId /* loggedinuser */,
			req.params.userId /*requested user*/
		)
	) {
		const err = new Error("Unauthorized Access");
		res.statusCode = 403;
		res.contentType = "application/json";
		return next(err);
	}
	next();
};

module.exports = {
	verifyToken,
	verifyAdmin,
	verifyLoungeAdmin,
	verifyPrivacy,
};
