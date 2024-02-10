const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = require("./user.model");

const commentSchema = new Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Users,
			required: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
			default: 0,
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

module.exports = { commentSchema };
