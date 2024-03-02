const configs = require("../config/configs");

const paginationParams = (req) => {
	const { page = configs.defaultPage, limit = configs.defaultLimit } =
		req.query;
	console.log("page", page, "limit", limit);
	const offset = (page - 1) * limit;
	return [page, offset, limit];
};

class paginatedResponse {
	constructor(data, page, limit, total) {
		this.data = data;
		this.page = page;
		this.limit = limit;
		this.total = total;
	}
}

module.exports = {
	paginationParams,
	paginatedResponse,
};
