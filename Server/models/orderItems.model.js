const { Schema, model } = require("mongoose");
const Dishes = require("./dish.model");
const Orders = require("./order.model");

const orderItemSchema = new Schema(
	{
		order: {
			type: Schema.Types.ObjectId,
			ref: Orders,
		},
		dish: {
			type: Schema.Types.ObjectId,
			ref: Dishes,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		subTotalPrice: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

const OrderItems = model("OrderItem", orderItemSchema);

module.exports = OrderItems;
