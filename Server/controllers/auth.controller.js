const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tokens = require("../models/token");
const crypto = require("crypto");
const { ObjectID } = require("bson");

const config = require("../config/config");
const Users = require("../models/users");
const userService = require("../services/user.services");
const authService = require("../services/auth.services");
const catchAsync = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const { generateJWTToken } = require("../utils/auth");

const activateUserAccount = catchAsync(async (req, res, next) => {
	const update = { $set: { isactivated: true } };
	const user = await userService.updateUser(req.params.id, update);
	res.statusCode = 200;
	res.send("Account Activated");
});

const signupController = catchAsync(async (req, res, next) => {
	const user = await userService.createUser(req);
	// send email to verify email
	const link = `http://localhost:${config.port}/auth/activateUserAccount/${user._id}`;
	const info = await sendEmail(
		user.email,
		"Account Activation",
		`<a href=${link}>Click to activate</a>`
	);

	res.statusCode = 200;
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
	const user = await authService.changePassword(
		req.body.user_id,
		req.body.oldPassword,
		req.body.newPassword
	);

	const info = await sendEmail(
		user.email,
		"Password Change",
		"Password Successfullly Changed"
	);
	res.statusCode = 200;
	res.contentType = "application/json";
	return res.json(info);
});

const passwordResetToken = (req, res, next) => {
	console.log(req.body.email);
	Users.findOne({ email: req.body.email }).then(async (user) => {
		if (!user) {
			res.statusCode = 404;
			res.send("User not found");
			return next();
		}

		const result = await Tokens.deleteMany({ user_id: ObjectID(user._id) });
		console.log(result);
		const token = crypto.randomBytes(32).toString("hex");
		const hashedToken = await bcrypt.hash(token, Number(process.env.SALT));
		const userToken = await Tokens.create({
			user_id: user._id,
			token: hashedToken,
		});
		console.log(userToken);
		const info = await sendEmail(user.email, "Reset Password", token);
		res.statusCode = 200;
		res.contentType = "application/json";
		console.log(info);
		res.json(info);
		return next();
	});
};

const resetPasswordController = (req, res, next) => {
	console.log(req.body);
	Users.findOne({ _id: req.body.user_id }).then(async (user) => {
		if (!user) {
			res.statusCode = 404;
			console.log("User not found");
			const err = new Error("User not found");
			res.send(err);
			return next(err);
		}
		console.log(user, req.body.user_id);
		const resetToken = await Tokens.findOne({ user_id: user._id });
		if (!resetToken) {
			res.statusCode = 403;
			console.log("token not found");
			res.contentType = "text/plain";
			const err = new Error("token not found");
			res.send(err);
			return next(err);
		}
		console.log(req.body.token);
		console.log(resetToken.token);
		const isValidToken = await bcrypt.compare(req.body.token, resetToken.token);
		console.log(isValidToken);
		if (!isValidToken) {
			res.statusCode = 403;
			console.log("Invalid");
			const err = new Error("Invalid or expired password reset token");
			return next(err);
		}

		user.setPassword(req.body.password, async (err, result) => {
			if (err) {
				console.log(err);
				res.statusCode = 400;
				res.contentType = "application/json";
				res.json(err);
				return next(err);
			}
			await user.save();
			const info = sendEmail(
				user.email,
				"Password Reset",
				"Password Successfullly Reseted"
			);
			res.statusCode = 200;
			res.contentType = "application/json";
			return res.json(info);
		});
	});
};

module.exports = {
	activateUserAccount,
	signupController,
	signinController,
	changePasswordController,
	passwordResetToken,
	resetPasswordController,
};
