const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJWTToken = (user, expiresIn = config.expiresIn) => {
	const token = jwt.sign(
		{ userId: user._id.valueOf() },
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

const encrypt = async (data) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(data, salt);
};

const compare = async (data, encryptedData) => {
	console.log(data, encryptedData);
	return await bcrypt.compare(data, encryptedData);
};

module.exports = {
	generateJWTToken,
	verifyJWTToken,
	encrypt,
	compare,
};
