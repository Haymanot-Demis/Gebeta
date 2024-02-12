require("dotenv").config();
const userService = require("../services/user.services");

const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");
const httpStatus = require("http-status");
const { USER_ROLES } = require("../utils/constants");
const catchAsync = require("../utils/asyncHandler");
const { checkOwnership } = require("../utils/auth");

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
				"bearer token not found in header"
			);
			throw err;
		}
		return bearerToken;
	} else {
		const err = ApiError(httpStatus.UNAUTHORIZED, "auth header is not found");
		throw err;
	}
};

const verifyToken = async (req, res, next) => {
	try {
		const token = getTokenFromHeader(req);
		console.log(token, process.env.SECRETE);
		const decoded = jwt.verify(token, process.env.SECRETE);
		req.user = decoded;
		console.log("decoded", decoded);
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
		!checkOwnership(
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

// TOD0: what if I give this a callback function to check ownership of the resource
const authorizeRoles = (roles) => {
	return (req, res, next) => {
		let isAuthorized = req.user.roles.some((role) => roles.includes(role));

		if (!isAuthorized) {
			const err = ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
			next(err);
		}
		next();
	};
};

module.exports = {
	verifyToken,
	verifyAdmin,
	verifyLoungeAdmin,
	verifyPrivacy,
	authorizeRoles,
};
