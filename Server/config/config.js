require("dotenv").config();

module.exports = {
	port: process.env.PORT,
	mongodbURL: process.env.MONGODB_URL,
	secretOrPrivateKey: process.env.SECRETE,
	expiresIn: process.env.TOKEN_EXPIRES_IN,
};
