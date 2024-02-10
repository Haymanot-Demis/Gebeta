const httpStatus = require("http-status");
const Users = require("../models/user.model");
const { compare, encrypt } = require("../utils/auth");
const { ApiError } = require("../utils/apiError");
const { isFound } = require("../utils/checks");
const { isAccountActive } = require("../utils/auth");

const loginWithEmailAndPassword = async (email, password) => {
	const user = await Users.findOne({ email }).populate("roles");

	isAccountActive(user);

	const isPasswordMathced = await compare(password, user?.password);

	if (!user || !isPasswordMathced) {
		throw ApiError(httpStatus.UNAUTHORIZED, "Invalid Credetial");
	}

	if (!user.isactivated) {
		throw ApiError(
			httpStatus.UNAUTHORIZED,
			"This account is not ready for use. Please wait until it is activated"
		);
	}

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
