require("dotenv").config();
const authenticate = require("../authenticate/authenticate");
const { Uploader } = require("../controllers/uploader");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sendEmail = require("./sendEmail");
const bcrypt = require("bcrypt");
const Tokens = require("../models/token");
const crypto = require("crypto");
const { ObjectID, ObjectId } = require("bson");

const getAllUsers = (req, res, next) => {
	Users.find({}).then((users) => {
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json(users);
	});
};

const activateUserAccount = (req, res, next) => {
	Users.findOne(req.body).then((user) => {
		user.isactivated = true;
		user.save((err, result) => {
			if (err) {
				res.statusCode = 400;
				res.contentType = "application/json";
				return next(err);
			}
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(result);
		});
	});
};

const signupController = (req, res, next) => {
	req.body.email = req.body.username;
	Users.register(req.body, req.body.password, async (err, user) => {
		if (err) {
			return next(err);
		}

		if (user.loungeAdmin) {
			user.isactivated = false;
		}

		if (req.file) {
			const uploaded_data = await Uploader(
				"C:/Projects/Gebeta/Server/" + req.file.path
			);
			console.log(uploaded_data);
			user.profileImage = uploaded_data.secure_url;
		}

		user
			.save()
			.then((user) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				return res.json({
					success: true,
					status: "Successfully Registered",
					user,
				});
			})
			.catch((err) => {
				res.statusCode = 500;
				res.contentType = "application/json";
				res.json({
					success: false,
					status: "Saving Failed",
					message: err.message,
				});
				return next(err);
			});
	});
};

const signinController = (req, res, next) => {
	if (req.user) {
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json({ success: true, status: "Already Loggedin" });
		return next();
	}

	try {
		passport.authenticate("local", (err, user, info) => {
			console.log("passport.authenticate");
			if (err) {
				console.log(err);
				return next(err);
			}
			if (!user) {
				console.log(info);
				res.statusCode = 401;
				res.contentType = "application/json";
				res.json({
					success: false,
					status: "Login Failed",
					info: info.message,
				});
			} else {
				//   if (!user.isactivated) {
				//     res.statusCode = 200;
				//     return res.send(
				//       "This account is not ready for use. Please wait until it is activated"
				//     );
				//   }
				console.log("user exists");
				req.logIn(user, (err) => {
					if (err) {
						console.log("login", err);
						res.statusCode = 401;
						res.contentType = "application/json";
						return res.json({
							success: false,
							status: "Login Failed",
							err,
						});
					}
					console.log("create token");
					const token = jwt.sign(
						{ id: req.user._id.valueOf() },
						process.env.SECRETE,
						{
							expiresIn: 3600,
						}
					);
					console.log(token);

					res.statusCode = 200;
					res.contentType = "application/json";
					return res.json({
						success: true,
						token,
						status: "Loggedin Successfully",
					});
				});
			}
		})(req, res, next);
	} catch (error) {
		// console.log(error);
	}
};

const changePasswordController = (req, res, next) => {
	Users.findById(req.user._id)
		.then((user) => {
			if (!user) {
				console.log("User is not found");
				res.statusCode = 401;
				res.contentType = "text/plain";
				res.send("User is not found");
				return next();
			}
			user.changePassword(
				req.body.oldPassword,
				req.body.newPassword,
				async (err, updated_user) => {
					if (err) {
						console.log(err.message);
						res.statusCode = 401;
						res.contentType = "application/json";
						res.json({ msg: err.message });
						return next(err);
					}
					const info = await sendEmail(
						user.email,
						"Password Change",
						"Password Successfullly Changed"
					);
					res.statusCode = 200;
					res.contentType = "application/json";
					return res.json(info);
				}
			);
		})
		.catch((err) => next(err));
};

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
	getAllUsers,
	activateUserAccount,
	signupController,
	signinController,
	changePasswordController,
	passwordResetToken,
	resetPasswordController,
};
