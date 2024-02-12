const httpStatus = require("http-status");
const Users = require("../models/user.model");
const { compare, encrypt } = require("../utils/auth");
const { ApiError } = require("../utils/apiError");
const { isFound } = require("../utils/checks");
const { isAccountActive } = require("../utils/auth");

const loginWithEmailAndPassword = async (email, password) => {
	const user = await Users.findOne({ email }).populate("roles");
	console.log(user);

	const isPasswordMathced = await compare(password, user?.password);

	if (!user || !isPasswordMathced) {
		throw ApiError(httpStatus.UNAUTHORIZED, "Invalid Credetial");
	}

	isAccountActive(user);

	user.password = undefined;
	return user;
};

const changePassword = async (userId, newPassword) => {
	const user = await Users.findById(userId);
	user.password = await encrypt(newPassword);
	await user.save();
	user.password = undefined;
	return user;
};

module.exports = { loginWithEmailAndPassword, changePassword };
