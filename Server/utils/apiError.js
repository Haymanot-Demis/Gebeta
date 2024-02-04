const ApiError = (status, message) => {
	const err = new Error(message);
	err.status = status;
	return err;
};

module.exports = ApiError;
