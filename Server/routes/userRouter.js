require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
	verifyPrivacy,
} = require("../middlewares/auth.middleware");

const { upload } = require("../middlewares/fileUploader");
const userController = require("../controllers/user.controller");

userRouter.use(bodyParser.json());

userRouter
	.route("/all")
	.get(verifyToken, verifyAdmin, userController.getAllUsers);

userRouter
	.route("/:userId")
	.get(verifyToken, verifyPrivacy, userController.getOneUser)
	.put(verifyToken, upload.single("profileImage"), userController.updateUser)
	.delete(verifyToken, verifyPrivacy, userController.deleteUser);

userRouter
	.route("addRole")
	.put(verifyToken, verifyAdmin, userController.addRole);

module.exports = userRouter;
