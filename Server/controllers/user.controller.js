require("dotenv").config();
const authenticate = require("../middlewares/auth.middleware");
const { cloudinaryUploader } = require("../middlewares/fileUploader");
const Users = require("../models/users");
const userservice = require("..//services/user.services");
const catchAsync = require("../utils/asyncHandler");

// get all users
const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await userservice.getAllUsers();
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(users);
});

// get one user by id

const getOneUser = catchAsync(async (req, res, next) => {
	const user = await userservice.getUserById(req.params.id);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

// update user
const updateUser = catchAsync(async (req, res, next) => {
	const user = await userservice.updateUser(req.params.id, req.body);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

// delete user
const deleteUser = catchAsync(async (req, res, next) => {
	const user = await userservice.deleteUser({ _id: req.params.id });
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(user);
});

const addRole = catchAsync(async (req, res, next) => {
	const user = await userservice.addRole(req.body.userId, req.body.roleId);
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
