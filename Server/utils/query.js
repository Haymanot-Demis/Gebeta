const configs = require("../config/configs");

const paginationParams = (req) => {
	const { page = configs.defaultPage, limit = configs.defaultLimit } =
		req.query;
	const offset = (page - 1) * limit;
	return [page, offset, limit];
};

module.exports = {
	paginationParams,
};
