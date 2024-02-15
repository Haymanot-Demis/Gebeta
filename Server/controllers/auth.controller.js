const Tokens = require("../models/token.model");
const { ObjectID } = require("bson");

const config = require("../config/config");
const userService = require("../services/user.services");
const authService = require("../services/auth.services");
const loungeService = require("../services/lounge.services");
const catchAsync = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const {
	generateJWTToken,
	checkOwnership,
	encrypt,
	generateResetPasswordToken,
	compare,
} = require("../utils/auth");
const { isFound } = require("../utils/checks");
const { ApiError, InvalidTokenException } = require("../utils/apiError");
const httpStatus = require("http-status");
const { DEFAULT_VALUES } = require("../utils/constants");

const activateUserAccount = catchAsync(async (req, res, next) => {
	const update = { $set: { isactivated: true } };
	const user = await userService.updateUser(req.params.id, update);
	res.statusCode = 200;
	res.send("Account Activated");
});

const signupController = catchAsync(async (req, res, next) => {
	const user = await userService.createUser(req);

	if (req.body.loungeAdmin) {
		const lounge = await loungeService.createLounge({
			name: req.body.loungeName ?? DEFAULT_VALUES.LOUNGE_NAME,
			loungeAdmin: user._id,
		});
		console.log(lounge);
	}

	// send email to verify email
	const link = `http://localhost:${config.port}/auth/activateUserAccount/${user._id}`;
	const info = await sendEmail(
		user.email,
		"Account Activation",
		`<a href=${link}>Click to activate</a>`
	);

	res.statusCode = 201;
	res.contentType = "application/json";
	return res.json({
		success: true,
		msg: "Successfully Registered, check your email to activate account",
	});
});

const signinController = catchAsync(async (req, res, next) => {
	const user = await authService.loginWithEmailAndPassword(
		req.body.email,
		req.body.password
	);

	console.log("create token");
	const token = generateJWTToken(user);

	console.log(token);

	res.statusCode = 200;
	res.contentType = "application/json";

	return res.json({
		success: true,
		status: "Loggedin Successfully",
		user,
		token,
	});
});

const changePasswordController = catchAsync(async (req, res, next) => {
	console.log(req.body);
	console.log(req.user);
	if (!checkOwnership(req.user.userId, req.body.user_id)) {
		throw ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
	}

	const user = await userService.getUserById(req.body.user_id);
	console.log(user);
	isFound(user, `User with id $(user._id} is`);

	const isPasswordMathced = await compare(req.body.oldPassword, user?.password);

	if (!user || !isPasswordMathced) {
		throw ApiError(httpStatus.UNAUTHORIZED, "Invalid Credetial");
	}

	const use = await authService.changePassword(
		req.body.user_id,
		req.body.newPassword
	);

	const info = await sendEmail(
		user.email,
		"Password Change",
		"Password Successfullly Changed"
	);

	res.statusCode = 204;
	res.contentType = "application/json";
	return res.json(info);
});

const resetPasswordToken = catchAsync(async (req, res, next) => {
	console.log(req.body.email);
	const user = await userService.getUserByEmail(req.body.email);

	// throw error if user not found
	isFound(user, `User with email ${req.body.email} is`);

	const result = await Tokens.deleteMany({ user_id: ObjectID(user._id) });
	console.log(result);

	const token = generateResetPasswordToken();
	const hashedToken = await encrypt(token);
	const userToken = await Tokens.create({
		user_id: user._id,
		token: hashedToken,
	});

	console.log(userToken);
	// send email to reset password
	const info = await sendEmail(user.email, "Reset Password", token);

	res.statusCode = 200;
	res.contentType = "application/json";
	console.log(info);
	res.json(info);
});

const resetPasswordController = catchAsync(async (req, res, next) => {
	const user = await userService.getUserByEmail(req.body.email);
	isFound(user, `User with email ${req.body.email} is`);

	const resetToken = await Tokens.findOne({ user_id: user._id });
	isFound(resetToken, "Reset Token");
	const isValidToken = await compare(req.body.token, resetToken.token);

	if (!isValidToken) {
		throw InvalidTokenException();
	}

	await authService.changePassword(user._id, req.body.password);

	const info = await sendEmail(
		user.email,
		"Password Reset",
		"Password Successfullly Reseted"
	);

	res.statusCode = 204;
	res.contentType = "application/json";
	res.json(info);
});

module.exports = {
	activateUserAccount,
	signupController,
	signinController,
	changePasswordController,
	resetPasswordToken,
	resetPasswordController,
};
