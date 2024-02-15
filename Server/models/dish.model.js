const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Lounges = require("./lounge.model");
const Users = require("./user.model");
const { commentSchema } = require("./comment.model");

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
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	tags: {
		type: [String],
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
		require: true,
	},
	orderCount: {
		type: Number,
		default: 0,
	},
	isAvailable: {
		type: Boolean,
		default: true,
	},
});

const Dishes = mongoose.model("Dish", dishSchema);
module.exports = Dishes;
