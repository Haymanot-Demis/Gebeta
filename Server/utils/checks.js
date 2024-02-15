const { ApiError } = require("./apiError");
const httpStatus = require("http-status");

const isFound = (obj, objType = "Entity") => {
	if (!obj) {
		throw ApiError(httpStatus.NOT_FOUND, objType + " not found");
	}
};

const alreadyExists = (obj, message) => {
	if (obj) {
		throw ApiError(httpStatus.BAD_REQUEST, message);
	}
};

module.exports = { isFound, alreadyExists };
