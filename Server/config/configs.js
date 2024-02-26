require("dotenv").config();

module.exports = {
	port: process.env.PORT,
	mongodbURL: process.env.MONGODB_URL,
	expiresIn: process.env.TOKEN_EXPIRES_IN,
	secretOrPrivateKey: process.env.JWT_SECRET,
	cloundinaryUrl: process.env.CLOUDINARY_URL,
	defaultPage: 1,
	defaultLimit: 10,
};
