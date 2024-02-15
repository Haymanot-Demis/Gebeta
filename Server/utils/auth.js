const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ApiError } = require("./apiError");
const crypto = require("crypto");

const generateJWTToken = (user, expiresIn = config.expiresIn) => {
	const token = jwt.sign(
		{
			userId: user._id.valueOf(),
			roles: user.roles.map((role) => role.name),
			isactivated: user.isactivated,
		},
		config.secretOrPrivateKey,
		{
			expiresIn: expiresIn,
		}
	);

	return token;
};

const verifyJWTToken = (token) => {
	try {
		const payload = jwt.verify(token, config.secrecOrKey);
		return payload;
	} catch (error) {
		throw new Error(`Invalid token: ${error.message}`);
	}
};

const generateResetPasswordToken = () => {
	return crypto.randomBytes(32).toString("hex");
};

const encrypt = async (data) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(data, salt);
};

const compare = async (data, encryptedData) => {
	console.log(data, encryptedData);
	return await bcrypt.compare(data, encryptedData);
};

// Compare the loggedin user id with the user id on which the operation is being performed
const checkOwnership = (loggedinUserId, userId) => {
	console.log("checkOwnership", loggedinUserId, userId);
	return loggedinUserId === userId;
};

const isAccountActive = (user) => {
	if (!user?.isactivated) {
		throw new Error(
			"This account is not ready for use. Please wait until it is activated"
		);
	}
};

module.exports = {
	generateJWTToken,
	verifyJWTToken,
	encrypt,
	compare,
	checkOwnership,
	isAccountActive,
	generateResetPasswordToken,
};
