require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const crypto = require("crypto");

cloudinary.config(process.env.CLOUDINARY_URL);
const Uploader = async (imagePath) => {
	const options = {
		use_filename: true,
		unique_filename: true,
		overwrite: true,
	};

	try {
		const result = await cloudinary.uploader.upload(imagePath, options);
		console.log(result);
		return result;
	} catch (error) {
		console.log(error);
	}
};

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

console.log(cloudinary.config());

module.exports = { cloudinary, Uploader, upload };
