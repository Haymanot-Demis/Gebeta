const { ApiError } = require("./apiError");

const catchAsync = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) =>
		next(ApiError(err.status, err.message, err.stack))
	);
};

module.exports = catchAsync;
