require("dotenv").config();
const authenticate = require("../middlewares/auth.middleware");
const { cloudinaryUploader } = require("../middlewares/fileUploader");
const Users = require("../models/user.model");
const userservice = require("..//services/user.services");
const catchAsync = require("../utils/asyncHandler");
const { isFound } = require("../utils/checks");
const { checkOwnership } = require("../utils/auth");
const { ApiError, UnauthorizedException } = require("../utils/apiError");

// get all users
const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await userservice.getAllUsers();
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(users);
});

// get one user by id
const getOneUser = catchAsync(async (req, res, next) => {
	const user = await userservice.getUserById(req.params.userId);
	isFound(user, "User");
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

// update user
const updateUser = catchAsync(async (req, res, next) => {
	const user = await userservice.getUserById(req.params.userId);
	isFound(user, "User");

	if (!checkOwnership(req.user.userId, req.params.userId)) {
		throw UnauthorizedException("Unauthorized Access");
	}

	// remove password from the request body since changing password here is not allowed
	req.body.password = undefined;

	if (req.file) {
		const result = await cloudinaryUploader(req.file.path);
		req.body.profileImage = result.secure_url;
	}

	const updated = await userservice.updateUser(user._id, req.body);

	// remove password from the response
	updated.password = undefined;

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(updated);
});

// TODO:  we need to cascade when we delete user
const deleteUser = catchAsync(async (req, res, next) => {
	const user = await userservice.deleteUser({ _id: req.params.id });
	isFound(user, "User");
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

const addRole = catchAsync(async (req, res, next) => {
	const user = await userservice.addRole(req.body.userId, {
		_id: req.body.roleId,
	});
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

// TODO: ADD revoke user role
const revokeRole = catchAsync(async (req, res, next) => {
	const user = await userservice.revokeRole(req.body.userId, {
		_id: req.body.roleId,
	});
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

module.exports = {
	getAllUsers,
	getOneUser,
	updateUser,
	deleteUser,
	addRole,
};
