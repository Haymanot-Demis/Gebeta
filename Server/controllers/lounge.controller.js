const loungeService = require("../services/lounge.services");
const userService = require("../services/user.services");
const { cloudinaryUploader } = require("../middlewares/fileUploader");
const catchAsync = require("../utils/asyncHandler");
const { NotFoundException, ApiError } = require("../utils/apiError");
const httpStatus = require("http-status");
const { USER_ROLES } = require("../constants/constants");
const { isFound } = require("../utils/checks");
const { checkOwnership } = require("../utils/auth");

const getLounge = catchAsync(async (req, res, next) => {
	const lounge = await loungeService.getLoungeById(req.params.id);
	isFound(lounge);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(lounge);
});

// TODO: pagination
const getLounges = catchAsync(async (req, res, next) => {
	const lounges = await loungeService.getAllLounges();
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(lounges);
	next();
});

const createLounge = catchAsync(async (req, res, next) => {
	const user = await userService.getUserById(req.body.loungeAdmin);

	console.log(user);

	if (!user) {
		throw NotFoundException("Lounge Admin not found");
	}

	const isLoungeAdmin = await userService.hasRole(
		user._id,
		USER_ROLES.LOUNGE_ADMIN
	);

	if (isLoungeAdmin) {
		throw ApiError(
			httpStatus.BAD_REQUEST,
			"User already has a lounge. Cannot create another lounge. Please contact the admin."
		);
	}

	if (req.file) {
		const result = await cloudinaryUploader(req.file.path);
		req.body.image = result.secure_url;
	}

	const newLounge = await loungeService.createLounge(req.body);
	await userService.addRole(user._id, { name: USER_ROLES.LOUNGE_ADMIN });
	res.statusCode = 201;
	res.contentType = "application/json";
	res.json(newLounge);
});

const updateLounge = catchAsync(async (req, res, next) => {
	const isExist = await loungeService.exists({
		_id: req.params.id,
		loungeAdmin: req.user.userId,
	});
	isFound(isExist, `Lounge with ${req.params.id} is`);

	if (req.file) {
		const result = await cloudinaryUploader(req.file.path);
		req.body.image = result.secure_url;
	}

	const lounge = await loungeService.updateLounge(req.params.id, req.body);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(lounge);
});

const deleteManyLounge = catchAsync(async (req, res, next) => {
	await loungeService.deleteMany(req.body);
});

const deleteLounge = catchAsync(async (req, res, next) => {
	const lounge = await loungeService.getLoungeById(req.params.id);

	isFound(lounge, `Lounge with id ${req.params.id} is`);

	const isAdmin = await userService.hasRole(req.user.userId, USER_ROLES.ADMIN);

	if (!isAdmin && req.user.userId !== lounge.loungeAdmin.toString()) {
		throw ApiError(
			httpStatus.FORBIDDEN,
			"You are not authorized to delete this lounge"
		);
	}

	const restult = await loungeService.deleteMany({
		_id: req.params.id,
	});

	const result = await userService.revokeRole(lounge.loungeAdmin, {
		name: USER_ROLES.LOUNGE_ADMIN,
	});

	console.log(result);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json({
		status: "success",
		message: "Lounge deleted successfully",
		restult,
	});
});

const getLoungesByAdmin = catchAsync(async (req, res, next) => {
	console.log(req.user.userId);
	const lounge = await loungeService.getLoungeByAdmin(req.user.userId);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(lounge);
	next();
});

module.exports = {
	getLounge,
	getLounges,
	createLounge,
	updateLounge,
	deleteLounge,
	deleteManyLounge,
	getLoungesByAdmin,
};
