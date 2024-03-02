const { cloudinaryUploader } = require("../middlewares/fileUploader");
const Users = require("../models/user.model");
const Roles = require("../models/role.model");
const { ApiError } = require("../utils/apiError");
const httpStatus = require("http-status");
const { isFound } = require("../utils/checks");
const { encrypt } = require("../utils/auth");
const roleServices = require("./role.services");
const { USER_ROLES } = require("../constants/constants");

const getRoles = async (role_id = undefined) => {
	// Fetch the default user role
	const userRole = await roleServices.getRoleByName(USER_ROLES.USER);
	if (!userRole) {
		throw ApiError(httpStatus.NOT_FOUND, "Default user role not found");
	}

	let roles = new Set([userRole._id]); // Default user role is always added

	if (role_id) {
		const role = await roleServices.getRoleById(role_id);
		if (!role) {
			throw ApiError(httpStatus.NOT_FOUND, "Requested role not found");
		}
		roles.push(role._id);
	}

	return roles;
};

const createUser = async (req) => {
	const { firstname, lastname, email, role_id } = req.body;
	const password = await encrypt(req.body.password);

	console.log(req.body);

	const roles = await getRoles(role_id);

	const newUser = await Users.create({
		firstname,
		lastname,
		email,
		password,
		roles,
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
	return user.roles;
};

const addRole = async (userId, roleFilter = {}) => {
	const user = await Users.findById(userId);
	isFound(user, "User");
	console.log(roleFilter);
	const role = await Roles.findOne(roleFilter);
	isFound(role, "Role");
	user.roles.push(role);
	await user.save();
	return user;
};

const revokeRole = async (userId, roleFilter = {}) => {
	const user = await Users.findById(userId);
	isFound(user, "User");
	const role = await Roles.findOne(roleFilter);
	isFound(role, "Role");
	user.roles.pull(role);
	await user.save();
	return user;
};

const hasRole = async (userId, role) => {
	const user = await Users.findById(userId).populate("roles");
	return user.roles.some((r) => {
		console.log(r.name, role);
		return r.name === role;
	});
};

const exists = async (userId) => {
	return await Users.exists({ _id: userId });
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
	revokeRole,
	exists,
	hasRole,
};
