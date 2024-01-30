require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
	isAuthenticated,
} = require("../authenticate/authenticate");
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
const { Uploader, upload, cloudinary } = require("../controllers/uploader");
const userController = require("../controllers/user.controller");

userRouter.use(bodyParser.json());

userRouter.route("/").get(verifyToken, (req, res, next) => {
	console.log(req.user);
	if (req.isAuthenticated()) {
		res.statusCode = 200;
		res.contentType = "application/json";
		res.json({ success: true, user: req.user });
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
	.post(upload.single("profileImage"), userController.signupController);

userRouter.route("/signin").post(userController.signinController);

userRouter.route("/logout").get((req, res, next) => {
	res.statusCode = 200;
	res.send({ success: true, msg: "logged out" });
});

userRouter
	.route("/account/changePassword")
	.post(verifyToken, isAuthenticated, userController.changePasswordController);

userRouter
	.route("/account/resetPassword")
	.post(userController.resetPasswordController);

userRouter
	.route("/account/resetPasswordRequest")
	.post(userController.passwordResetToken);

userRouter
	.route("/all")
	.get(verifyToken, isAuthenticated, verifyAdmin, userController.getAllUsers);

userRouter
	.route("/activateUserAccount")
	.put(verifyToken, verifyAdmin, userController.activateUserAccount);

module.exports = userRouter;
