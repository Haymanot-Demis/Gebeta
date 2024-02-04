require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
	isAuthenticated,
} = require("../middlewares/auth.middleware");
const passport = require("passport");
const Users = require("../models/users");
const Tokens = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { ObjectID, ObjectId } = require("bson");
const sendEmail = require("../utils/sendEmail");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const {
	cloudinaryUploader,
	upload,
	cloudinary,
} = require("../middlewares/fileUploader");
const userController = require("../controllers/user.controller");

userRouter.use(bodyParser.json());

userRouter.route("/all").get(verifyToken, userController.getAllUsers);

userRouter
	.route("/:userId")
	.get(verifyToken, userController.getOneUser)
	.put(verifyToken, userController.updateUser)
	.delete(verifyToken, userController.deleteUser)
	.put(userController.addRole);

module.exports = userRouter;
