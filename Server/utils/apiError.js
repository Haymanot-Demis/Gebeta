const ApiError = (status, message, stack = null) => {
	const err = new Error(message);
	err.status = status;
	err.stack = stack?.split("\n").map((line) => line.trim());
	return err;
};

const NotFoundException = (message = "Entity not found") => {
	return ApiError(404, message);
};

const BadRequestException = (message = "Bad request") => {
	return ApiError(400, message);
};

const UnauthorizedException = (message = "Unauthorized") => {
	return ApiError(401, message);
};

const ForbiddenException = (message = "Forbidden") => {
	return ApiError(403, message);
};

const InternalServerErrorException = (message = "Internal server error") => {
	return ApiError(500, message);
};

const InvalidTokenException = (
	message = "Invalid or expired password reset token"
) => {
	return ApiError(httpStatus.BAD_REQUEST, message);
};

module.exports = {
	ApiError,
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
	ForbiddenException,
	InternalServerErrorException,
	InvalidTokenException,
};
