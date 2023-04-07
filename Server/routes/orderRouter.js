require("dotenv").config();
const express = require("express");
const orderRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
	isAuthenticated,
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
} = require("../authenticate/authenticate");
const Orders = require("../models/orders");
const lounges = require("../models/lounges");

orderRouter.use(bodyParser.json());
orderRouter.use(express.urlencoded({ extended: true }));

orderRouter
	.route("/")
	.get(isAuthenticated, (req, res, next) => {
		// Orders.find({ user: req.user._id })
		Orders.find({})
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
	})
	.post(isAuthenticated, async (req, res, next) => {
		console.log(req.body);
		const dish = await Dishes.findOne(
			{ _id: req.body.dish },
			{ price: 1, lounge: 1 }
		);
		const totalPrice = req.body.quantity * dish.price;
		req.body.totalPrice = totalPrice;
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
	});

orderRouter
	.route("/:orderId")
	.get(isAuthenticated, (req, res, next) => {
		// Orders.find({ user: req.user._id })
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
	})
	.put(isAuthenticated, async (req, res, next) => {
		Orders.findOne(
			// { user: req.user._id },
			{ _id: req.params.orderId }
		).then((order) => {
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
					// { user: req.user._id },
					{ _id: req.params.orderId },
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
				// { user: req.user._id },
				{ _id: req.params.orderId },
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
		});
	})
	.delete(isAuthenticated, (req, res, next) => {
		// Orders.deleteMany({ user: req.user._id, dish: req.params.id });
		Orders.find({ _id: req.params.orderId }).then((order) => {
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
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({ msg: "You are not in time to decline an order" });
				return next(new Error("You are not in time to decline an order"));
			}
			Orders.deleteMany({ _id: req.params.orderId })
				.then((result) => {
					res.statusCode = 200;
					res.contentType = "application/json";
					res.json(result);
					next();
				})
				.catch((err) => next(err));
		});
	});

orderRouter
	.route("/loungeAdmin/all")
	.get(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
		// const lounge = await lounges.findOne({ loungeAdmin: req.user._id }); // to know the lounge belongs to the admin
		// Orders.find({ lounge: lounge._id })
		Orders.find()
			.populate("user")
			.populate("dish")
			.then((orders) => {
				res.statusCode = 200;
				res.contentType = "application/json";
				res.json(orders);
				next();
			})
			.catch((err) => next(err));
	});

orderRouter
	.route("/loungeAdmin/:orderId")
	.put(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
		Orders.findOneAndUpdate(
			// { user: req.user._id },
			{ _id: req.params.orderId },
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
	});

module.exports = orderRouter;
