const { cloudinaryUploader } = require("../middlewares/fileUploader");
const Users = require("../models/users");
const Roles = require("../models/role.model");
const { ApiError } = require("../utils/apiError");
const httpStatus = require("http-status");
const { isFound } = require("../utils/checks");
const { encrypt } = require("../utils/auth");

const createUser = async (req) => {
	const { firstname, lastname, email, role_id } = req.body;
	const password = await encrypt(req.body.password);

	console.log(req.body);

	const role = await Roles.findById(role_id);

	if (!role) {
		throw ApiError(httpStatus.NOT_FOUND, "Role not found");
	}

	const newUser = await Users.create({
		firstname,
		lastname,
		email,
		password,
		roles: [role],
	});

	console.log(req.file);

	if (req.file) {
		const result = await cloudinaryUploader(req.file.path);
		newUser.profileImage = result.secure_url;
	}

	await newUser.save();
	return newUser;
};

const getUserById = async (userId) => {
	const user = await Users.findById(userId);
	isFound(user, "User");
	return user;
};

const getUserByEmail = async (email) => {
	const user = await Users.findOne({ email: email });
	return user;
};

const getAllUsers = async () => {
	const users = await Users.find({}).select("-password");
	return users;
};

const updateUser = async (userId, update) => {
	var user = await Users.findOneAndUpdate({ _id: userId }, update, {
		new: true,
	}).select("-password");
	isFound(user, "User");
	return user;
};

const deleteUser = async (filter) => {
	await Users.deleteOne(filter);
};

const deleteMany = async (filter) => {
	await Users.deleteMany(filter);
};

const getRolesOfUser = async (userId) => {
	const user = await Users.findById(userId)
		.populate("roles")
		.select({ roles: 1 });
	isFound(user, "User");
	return user.roles;
};

const addRole = async (userId, roleId) => {
	const user = await Users.findById(userId);
	isFound(user, "User");
	const role = await Roles.findById(roleId);
	isFound(role, "Role");
	user.roles.push(role);
	await user.save();
	return user;
};

module.exports = {
	createUser,
	getUserById,
	getUserByEmail,
	getAllUsers,
	getRolesOfUser,
	updateUser,
	deleteUser,
	deleteMany,
	addRole,
};
