const mongoose = require("mongoose");
const Dishes = require("./dishes");
const Lounges = require("./lounges");
const Users = require("./users");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Users,
		},
		dish: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Dishes,
		},
		lounge: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Lounges,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		deliveryType: {
			type: String,
			default: "dinein",
		},
		palceToDeliver: {
			type: String,
			default: "",
		},
		timeToCome: {
			type: Date,
			default: Date.now() + 3600,
		},
		totalPrice: {
			type: Number,
		},
		status: {
			type: String,
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

const Orders = mongoose.model("order", orderSchema);

module.exports = Orders;
