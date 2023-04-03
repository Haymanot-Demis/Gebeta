const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Lounges = require("./lounges");
const Users = require("./users");

const commentSchema = new Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Users,
			default: "641acad3d4d88fa9291e44e3",
		},
		lounge: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Lounges,
			default: "641768cfa16c164b38ac0358",
		},
		read: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
			default: 3,
		},
		comment: {
			type: String,
			required: true,
			default:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi sit debitis dolores, id esse quibusdam sapiente ex ab quaerat quis eos adipisci cupiditate repellendus reprehenderit possimus mollitia et tempore amet?",
		},
	},
	{
		timestamps: true,
	}
);

const dishSchema = new Schema({
	name: {
		type: String,
		unique: true,
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

const Dishes = mongoose.model("dish", dishSchema);

module.exports = Dishes;
