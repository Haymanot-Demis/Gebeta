const { TokenExpiredError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = require("./user.model");

const tokenSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: Users,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

tokenSchema.index({ createdAt: "1" }, { expireAfterSeconds: 15 * 60 });

const Tokens = mongoose.model("Token", tokenSchema);

module.exports = Tokens;
