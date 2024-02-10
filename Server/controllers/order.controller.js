const Orders = require("../models/orders");
const Lounges = require("../models/lounge.model");

const getOrder = (req, res, next) => {
	Orders.find({ _id: req.params.orderId })
		.populate("user")
		.populate("dish")
		.populate("lounge")
		.then((order) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(order);
			next();
		})
		.catch((err) => next(err));
};

// TODO, get orders of the logged in user, we need to have a service of getting orders by order owner and loungeAdmin
const getManyOrders = (req, res, next) => {
	Orders.find({ user: req.user._id })
		.sort({ createdAt: 1 })
		.populate("user")
		.populate("dish")
		.populate("lounge")
		.then((orders) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(orders);
			next();
		})
		.catch((err) => next(err));
};

const createOrder = async (req, res, next) => {
	console.log(req.body);
	const dish = await Dishes.findOne(
		{ _id: req.body.dish },
		{ price: 1, lounge: 1 }
	);
	const totalPrice = req.body.quantity * dish.price;
	req.body.totalPrice = totalPrice;
	req.body.user = req.user._id;
	Orders.create(req.body)
		.then(async (order) => {
			dish.orderCounter += 1;
			await dish.save();
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(order);
			next();
		})
		.catch((err) => next(err));
};

const updateOrder = async (req, res, next) => {
	console.log(req.user);
	Orders.findOne({ _id: req.params.orderId, user: req.user._id }).then(
		(order) => {
			if (!order) {
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({ msg: "Order not found" });
				return next(new Error("Order not found"));
			}
			if (new Date(order.timeToCome).getTime() < Date.now()) {
				res.statusCode = 406;
				res.contentType = "application/json";
				res.json({ msg: "You can't update past orders" });
				return next(new Error("You can't update past orders"));
			}

			if (
				new Date(order.timeToCome).getTime() - Date.now() <
				process.env.ALLOWED_TIME
			) {
				Orders.findOneAndUpdate(
					{ _id: req.params.orderId, user: req.user._id },
					{
						$set: {
							deliveryType: req.body.deliveryType ?? order.deliveryType,
							palceToDeliver: req.body.palceToDeliver ?? order.palceToDeliver,
						},
					},
					{
						new: true,
					}
				)
					.then((order) => {
						res.statusCode = 406;
						res.contentType = "application/json";
						res.json({
							msg: "You are not in time to update orders, only delivery type and place are upadared",
						});
						return next();
					})
					.catch((err) => next(err));
			}

			Orders.findOneAndUpdate(
				{ _id: req.params.orderId, user: req.user._id },
				{
					$set: req.body,
				},
				{
					new: true,
				}
			)
				.then((order) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(order);
					next();
				})
				.catch((err) => next(err));
		}
	);
};

// TODO: delete order must be corrected
const deleteOrder = (req, res, next) => {
	Orders.findOne({ _id: req.params.orderId, user: req.user._id }).then(
		(order) => {
			if (!order) {
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({ msg: "Order not found" });
				return next(new Error("Order not found"));
			}

			if (
				new Date(order.timeToCome).getTime() - Date.now() <
				process.env.ALLOWED_TIME
			) {
				res.statusCode = 406;
				res.contentType = "application/json";
				res.json({ msg: "You are not in time to decline an order" });
				return next(new Error("You are not in time to decline an order"));
			}
			Orders.deleteOne({ _id: req.params.orderId })
				.then((result) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(result);
					next();
				})
				.catch((err) => next(err));
		}
	);
};

// get all orders of a lounge
const getOrdersOfLounge = async (req, res, next) => {
	const lounge = await Lounges.findOne({ loungeAdmin: req.user._id }); // to get the orders belongs to the admin's lounge

	if (!lounge) {
		res.statusCode = 404;
		res.contentType = "application/json";
		res.json({ msg: "Lounge not found" });
		return next(new Error("Lounge not found"));
	}

	Orders.find({ lounge: lounge._id })
		.populate("user")
		.populate("dish")
		.then((orders) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(orders);
			next();
		})
		.catch((err) => next(err));
};

// Update order status by admin
const updateOrderStatus = async (req, res, next) => {
	Orders.findOneAndUpdate(
		{ _id: req.params.orderId },
		{
			$set: {
				status: req.body.status,
			},
		},
		{
			new: true,
		}
	)
		.then((order) => {
			res.statusCode = 200;
			res.contentType = "application/json";
			res.json(order);
			next();
		})
		.catch((err) => next(err));
};

module.exports = {
	getOrder,
	getManyOrders,
	createOrder,
	updateOrder,
	deleteOrder,
	getOrdersOfLounge,
	updateOrderStatus,
};
