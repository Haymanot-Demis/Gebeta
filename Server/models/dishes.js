const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Lounges = require("./lounge.model");
const Users = require("./user.model");
const { commentSchema } = require("./comments");

const dishSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	isfasting: {
		type: Boolean,
		default: true,
	},
	type: {
		// select from a datalist
		type: String,
		required: true,
	},
	category: {
		// select from a datalist
		type: String,
		required: true,
	},
	comment: [commentSchema],
	description: {
		type: String,
		required: true,
	},
	lounge: {
		// select from a datalist
		type: mongoose.Schema.Types.ObjectId,
		ref: Lounges,
	},
	orderCount: {
		type: Number,
		default: 0,
	},
});

const Dishes = mongoose.model("Dish", dishSchema);

module.exports = Dishes;
