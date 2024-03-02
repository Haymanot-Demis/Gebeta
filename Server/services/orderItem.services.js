const OrderItems = require("../models/orderItems.model");

const getOrderItemById = (orderItemId) => {
	return OrderItems.findById(orderItemId).populate({
		path: "dish",
		select: "name",
	});
};

const getOrderItemsByOrderId = (orderId, offset, limit) => {
	return OrderItems.find({ order: orderId })
		.populate({
			path: "dish",
			select: "name",
		})
		.skip(offset)
		.limit(limit);
};

const createOrderItem = async (orderItem) => {
	return OrderItems.create(orderItem);
};

const deleteOrderItem = async (orderItemId) => {
	return OrderItems.findByIdAndDelete(orderItemId);
};

module.exports = {
	getOrderItemById,
	getOrderItemsByOrderId,
	createOrderItem,
	deleteOrderItem,
};
