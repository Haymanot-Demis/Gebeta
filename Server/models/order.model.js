const { Schema, model } = require("mongoose");
const Users = require("./user.model");
const Lounges = require("./lounge.model");
const {
	DELIVARY_TYPES,
	ORDER_STATUS,
	PAYMENT_STATUS,
	PAYMENT_TYPES,
} = require("../constants/constants");

const orderSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: Users,
		},
		lounge: {
			type: Schema.Types.ObjectId,
			ref: Lounges,
		},
		deliveryType: {
			type: String,
			enum: Object.values(DELIVARY_TYPES),
			default: DELIVARY_TYPES.DINEIN,
		},
		palceToDeliver: {
			type: String,
			default: "",
		},
		timeToCome: {
			type: Date,
			default: Date.now() + 4000000,
		},
		totalPrice: {
			type: Number,
		},
		status: {
			type: String,
			enum: Object.values(ORDER_STATUS),
			default: ORDER_STATUS.PENDING,
		},
		payment: {
			id: String,
			type: {
				type: String,
				enum: Object.values(PAYMENT_TYPES),
				default: PAYMENT_TYPES.CASH,
			},
			status: {
				type: String,
				enum: Object.values(PAYMENT_STATUS),
				default: PAYMENT_STATUS.PENDING,
			},
			amount: Number,
		},
	},
	{
		timestamps: true,
	}
);

const Orders = model("Order", orderSchema);

module.exports = Orders;
