require("dotenv").config();
const express = require("express");
const orderRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
	verifyAdmin,
	verifyLoungeAdmin,
	verifyToken,
} = require("../middlewares/auth.middleware");
const Orders = require("../models/orders");
const lounges = require("../models/lounges");
const orderController = require("../controllers/order.controller");

orderRouter.use(bodyParser.json());
orderRouter.use(express.urlencoded({ extended: true }));

orderRouter
	.route("/")
	// get all orders of the logged in user
	.get(verifyToken, orderController.getManyOrders)
	// create a new order
	.post(verifyToken, orderController.createOrder);

orderRouter
	.route("/:orderId")
	// get a specific order
	.get(verifyToken, orderController.getOrder)
	// update a specific order
	.put(verifyToken, orderController.updateOrder)
	// delete a specific order
	.delete(verifyToken, orderController.deleteOrder);

orderRouter
	.route("/loungeAdmin/all")
	// get all orders in the lounge
	.get(verifyToken, verifyLoungeAdmin, orderController.getOrdersOfLounge);

orderRouter
	.route("/loungeAdmin/:orderId")
	// update a specific order status by admin
	.put(verifyToken, verifyLoungeAdmin, orderController.updateOrderStatus);

module.exports = orderRouter;
