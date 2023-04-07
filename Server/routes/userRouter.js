require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const authenticate = require("../authenticate/authenticate");
const passport = require("passport");
const Users = require("../models/users");
const Tokens = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { ObjectID, ObjectId } = require("bson");
const sendEmail = require("../controllers/sendEmail");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/loungeImages");
	},
	filename: (req, file, cb) => {
		const extname = file.originalname.split(".")[1];
		const filename =
			file.originalname.split(".")[0] + crypto.randomBytes(5).toString("hex");
		console.log(extname, filename);
		cb(null, filename + "." + extname);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		console.log("filename", file);
		if (!file.originalname) {
			console.log("no file is uploaded");
			return cb(new Error("no file is uploaded"));
		}
		console.log(file.originalname.match(/\.(jpg|jpeg|png|gif|gfif)$/));
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/)) {
			console.log("Image file format must be .jpg . jpeg .gif .png");
			return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
		}
		return cb(null, true);
	},
});

userRouter.use(bodyParser.json());

userRouter.route("/").get((req, res, next) => {
	if (req.isAuthenticated()) {
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json(req.user);
		return next();
	} else {
		res.statusCode = 401;
		res.contentType = "application/json";
		res.json({ success: false });
		next(new Error("Not Authenticated"));
	}
});
userRouter
	.route("/signup")
	.post(upload.single("profileImage"), (req, res, next) => {
		console.log(req.body);
		console.log(req.file);
		req.body.email = req.body.username;
		Users.register(req.body, req.body.password, (err, user) => {
			if (err) {
				return next(err);
			}
			const authenticate = Users.authenticate();
			authenticate(req.body.username, req.body.password, (err, result) => {
				if (err) {
					return next(err);
				}

				if (user.loungeAdmin) {
					user.isactivated = false;
				}

				user.profileImage = "http://127.0.0.1:5500/Server/" + req.file.path;
				console.log(user);
				user
					.save()
					.then((user) => {
						res.statusCode = 200;
						res.contentType = "application/json";
						return res.json({
							success: true,
							status: "Successfully Resgistered",
							user,
						});
					})
					.catch((err) => {
						next(err);
					});
			});
		});
	});

// userRouter.route('/signin')
// .post(passport.authenticate('local', {failureRedirect:'/'}), (req, res, next) => {
//     console.log(req.user,"after signin");
//     res.statusCode = 200;
//     res.contentType = 'application/json';
//     return res.json({"success" : true, "status" : "Login Successfully"});
//     next()
// });

userRouter.route("/signin").post((req, res, next) => {
	console.log(req.method);
	console.log(req.headers.authorization);
	console.log(req.headers);
	console.log(req.body);
	console.log("user", req.user);
	console.log(req.session);
	if (req.user) {
		console.log("logged in", req.user);
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json({ success: true, status: "Already Loggedin" });
		return next();
	}
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			console.log(user);
			res.statusCode = 401;
			res.contentType = "application/json";
			res.json({ success: false, status: "Login Failed", info });
		} else {
			//   if (!user.isactivated) {
			//     res.statusCode = 200;
			//     return res.send(
			//       "This account is not ready for use. Please wait until it is activated"
			//     );
			//   }
			req.logIn(user, (err) => {
				if (err) {
					console.log(err);
					res.statusCode = 401;
					res.contentType = "application/json";
					return res.json({
						success: false,
						status: "Login Failed",
						err,
					});
				}
				console.log("logged in", req.user);
				res.statusCode = 200;
				res.contentType = "application/json";
				res.cookie("user", req.user.firstname);
				const token = jwt.sign(req.user._id.valueOf(), process.env.SECRETE);
				return res.json({ success: true, token, status: "Login Successfully" });
			});
		}
	})(req, res, next);
});

userRouter.route("/logout").get((req, res, next) => {
	req.logOut();
	res.redirect("/");
});

userRouter
	.route("/account/changePassword")
	.post(authenticate.isAuthenticated, (req, res, next) => {
		Users.findByUsername(req.user.username)
			.then((user) => {
				if (!user) {
					res.statusCode = 401;
					res.contentType = "text/plain";
					res.send("User is found");
					return next();
				}
				console.log(user);
				user.changePassword(
					req.body.oldPassword,
					req.body.newPassword,
					(err, result) => {
						if (err) {
							res.statusCode = 400;
							res.contentType = "application/json";
							res.json(err);
							return next(err);
						}
						const info = sendEmail(
							user.email,
							"Password Change",
							"Password Successfullly Changed"
						);
						console.log(JSON.parsei(info));
						res.statusCode = 200;
						res.contentType = "text/html";
						return res.send(result);
					}
				);
			})
			.catch((err) => next(err));
	});

userRouter.route("/account/resetPassword").post((req, res, next) => {
	Users.findOne({ _id: req.body.user_id }).then(async (user) => {
		console.log(user, req.body.user_id);
		const resetToken = await Tokens.findOne({ user_id: ObjectId(user._id) });
		if (!resetToken) {
			res.statusCode = 403;
			console.log("token not found");
			const err = new Error("Invalid or expired password reset token");
			return next(err);
		}
		const isValidToken = await bcrypt.compare(req.body.token, resetToken.token);
		if (!isValidToken) {
			res.statusCode = 403;
			console.log("Invalid");
			const err = new Error("Invalid or expired password reset token");
			return next(err);
		}
		user.setPassword(req.body.password, async (err, result) => {
			if (err) {
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
			res.contentType = "text/html";
			console.log(JSON.parse(info));
			return res.send(result);
		});
	});
});

userRouter.route("/account/resetPasswordRequest").post((req, res, next) => {
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
		res.json(JSON.parse(info));
		return next();
	});
});

userRouter
	.route("/all")
	.get(
		authenticate.isAuthenticated,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Users.find(req?.body).then((users) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(users);
			});
		}
	);

userRouter.route("/activateUserAccount").put((req, res, next) => {
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
});

module.exports = userRouter;
