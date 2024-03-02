const Orders = require("../models/order.model");
const Dishes = require("../models/dish.model");
const orderServices = require("../services/order.services");
const orderItemServices = require("../services/orderItem.services");
const loungeServices = require("../services/lounge.services");

const { isFound } = require("../utils/checks");
const catchAsync = require("../utils/asyncHandler");
const configs = require("../config/configs");
const { checkOwnership } = require("../utils/auth");
const {
	UnauthorizedException,
	BadRequestException,
	NotFoundException,
} = require("../utils/apiError");
const { ORDER_STATUS } = require("../constants/constants");
const { paginationParams, paginatedResponse } = require("../utils/pagination");

const createOrder = catchAsync(async (req, res, next) => {
	const { cart, deliveryType, palceToDeliver, timeToCome } = req.body;

	var totalPrice = 0;
	var dish;

	for (let orderItem of cart) {
		dish = await Dishes.findOne(
			{ _id: orderItem.dish },
			{ price: 1, lounge: 1 }
		);

		isFound(dish, `Dish with id ${orderItem.dish} is `);

		orderItem.subTotalPrice = orderItem.quantity * dish.price;
		totalPrice += orderItem.subTotalPrice;
		dish.orderCounter += orderItem.quantity;
		await dish.save();
	}

	const order = await orderServices.createOrder({
		user: req.user.userId,
		lounge: dish.lounge,
		deliveryType,
		palceToDeliver,
		timeToCome,
		totalPrice,
	});

	console.log("order", order);
	console.log("cart", cart);

	for (let orderItem of cart) {
		orderItem.order = order._id;
		await orderItemServices.createOrderItem(orderItem);
	}

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(order);
	next();
});

const getAllOrders = catchAsync(async (req, res, next) => {
	const orders = await orderServices.getAllOrders();
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(orders);
	next();
});

const getOrder = catchAsync(async (req, res, next) => {
	const order = await orderServices.getOrder({ _id: req.params.orderId });

	isFound(order, `Order with id ${req.params.orderId} is `);
	const isOwner = checkOwnership(req.user.userId, order.user);

	if (!isOwner) {
		const lounge = await loungeServices.getLoungeById(order.lounge);
		const isLoungeAdmin = checkOwnership(req.user.userId, lounge.loungeAdmin);

		if (!isLoungeAdmin) {
			throw UnauthorizedException("You are not authorized to get this order");
		}
	}

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(order);
	next();
});

const findOrders = async (req, condition) => {
	const [page, offset, limit] = paginationParams(req);

	let orders = await orderServices.getOrders(condition, offset, limit);
	console.log("orders", orders);

	// orders = await Promise.all(
	// 	orders.map(async (order) => {
	// 		const items = await orderItemServices.getOrderItemsByOrderId(
	// 			order._id,
	// 			0,
	// 			3
	// 		);

	// 		console.log("items", items);
	// 		console.log("order", order);

	// 		// Assuming you're using an ECMAScript version that supports the spread operator
	// 		return { ...order, items: items };
	// 	})
	// );

	const total = await orderServices.count(condition);

	return new paginatedResponse(orders, page, limit, total);
};

const getOrdersOfUser = catchAsync(async (req, res, next) => {
	const condition = { user: req.user.userId };
	const response = await findOrders(req, condition);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(response);
	next();
});

// get all orders of a lounge
const getOrdersOfLounge = catchAsync(async (req, res, next) => {
	const lounge = await loungeServices.getLoungeByAdmin(req.user.userId); // to get the orders belongs to the admin's lounge

	if (!lounge) {
		throw NotFoundException("There is no lounge for this admin user");
	}

	const condition = { lounge: lounge._id };
	const response = await findOrders(req, condition);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(response);
	next();
});

// TODO:
// updating is allowed only deliveryType, and placeToDeliver within a certain time
const updateOrder = catchAsync(async (req, res, next) => {
	const { deliveryType, palceToDeliver, timeToCome } = req.body;

	const order = await orderServices.getOrder({ _id: req.params.orderId });

	isFound(order, `Order with id ${req.params.orderId} is `);

	const isOwner = checkOwnership(req.user.userId, order.user);

	if (!isOwner) {
		throw UnauthorizedException("You are not authorized to update this order");
	}

	console.log(order.timeToCome, new Date(Date.now()));
	let seconds = (new Date(order.timeToCome).getTime() - Date.now()) / 1000;

	console.log(seconds, configs.orderUpdateTimeLimit);

	if (seconds < configs.orderUpdateTimeLimit) {
		throw BadRequestException("You are not in time to update an order");
	}

	const updatedOrder = await orderServices.updateOrder(req.params.orderId, {
		deliveryType,
		palceToDeliver,
		timeToCome,
	});

	updatedOrder.items = await orderItemServices.getOrderItemsByOrderId(
		order._id,
		0,
		3
	);

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(updatedOrder);
	next();
});

const cancelOrder = catchAsync(async (req, res, next) => {
	const { orderId } = req.params;
	const order = await orderServices.getOrder({ _id: orderId });

	isFound(order, `Order with id ${orderId} is `);

	const isOwner = checkOwnership(req.user.userId, order.user);

	if (!isOwner) {
		throw UnauthorizedException("You are not authorized to cancel this order");
	}

	const seconds = (new Date(order.timeToCome).getTime() - Date.now()) / 1000;
	if (seconds < configs.orderCancelTimeLimit) {
		throw BadRequestException("You are not in time to cancel an order");
	}

	const canceledOrderOrder = await orderServices.updateOrder(orderId, {
		status: ORDER_STATUS.CANCELED,
	});

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(canceledOrderOrder);
	next();
});

// Update order status by admin
const updateOrderStatus = catchAsync(async (req, res, next) => {
	const { orderId } = req.params;
	const { status } = req.body;

	const order = await orderServices.getOrder({ _id: orderId });

	isFound(order, `Order with id ${orderId} is `);

	const lounge = await loungeServices.getLoungeByAdmin(req.user.userId);

	if (!lounge) {
		throw NotFoundException("There is no lounge for this admin user");
	}

	if (lounge._id != order.lounge) {
		throw UnauthorizedException("You are not authorized to update this order");
	}

	const updatedOrder = await orderServices.updateOrder(orderId, { status });

	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(updatedOrder);
	next();
});

module.exports = {
	getOrder,
	createOrder,
	updateOrder,
	cancelOrder,
	getOrdersOfUser,
	getOrdersOfLounge,
	updateOrderStatus,
	getAllOrders,
};
