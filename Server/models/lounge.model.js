const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = require("./user.model");

const loungeSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	loungeAdmin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Users,
		required: true,
		unique: true,
	},
	image: {
		type: String,
		default: "",
	},
	rating: {
		type: Number,
		default: 3,
		min: 1,
		max: 5,
	},
	services: [
		{
			type: String,
		},
	],
	about: {
		type: String,
		default: "",
	},
});

module.exports = mongoose.model("Lounge", loungeSchema);
