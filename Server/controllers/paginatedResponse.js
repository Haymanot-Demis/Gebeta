class paginatedResponse {
	constructor(data, page, limit, total) {
		this.data = data;
		this.page = page;
		this.limit = limit;
		this.total = total;
	}
}

module.exports = paginatedResponse;
