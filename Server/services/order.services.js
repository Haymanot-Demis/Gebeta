const Orders = require("../models/order.model");
const OrderItems = require("../models/orderItems.model");

const getOrder = (filter) => {
	return Orders.findOne(filter);
};

const getOrders = (filter, offset, limit) => {
	return Orders.find(filter).populate("").skip(offset).limit(limit);
};

const createOrder = async (order) => {
	return Orders.create(order);
};

const updateOrder = async (orderId, order) => {
	return Orders.findByIdAndUpdate(orderId, { $set: order }, { new: true });
};

const deleteOrder = async (orderId) => {
	return Orders.findByIdAndDelete(orderId);
};

const count = async (query) => {
	return Orders.countDocuments(query);
};

module.exports = {
	getOrder,
	getOrders,
	createOrder,
	updateOrder,
	deleteOrder,
	count,
};
