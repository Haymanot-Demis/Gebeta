const express = require("express");
const orderRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
  isAuthenticated,
  verifyAdmin,
  verifyLoungeAdmin,
} = require("../authenticate/authenticate");
const Orders = require("../models/orders");
const lounges = require("../models/lounges");

orderRouter.use(bodyParser.json());
orderRouter.use(express.urlencoded({ extended: true }));

orderRouter
  .route("/:dishName/:id")
  .post(isAuthenticated, async (req, res, next) => {
    const dish = await Dishes.findOne({ _id: req.params.id }, { price: 1 });
    const totalPrice = req.body.quantity * dish.price;
    req.body.totalPrice = totalPrice;
    Orders.create({ user: req.user._id, dish: req.params.id, ...req.body })
      .then(async (order) => {
        dish.orderCounter += 1;
        await dish.save();
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(order);
        next();
      })
      .catch((err) => next(err));
  })
  .put(isAuthenticated, async (req, res, next) => {
    const dish = await Dishes.findOne({ _id: req.params.id }, { price: 1 });
    const totalPrice = req.body.quantity * dish.price;
    req.body.totalPrice = totalPrice;
    Orders.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          user: req.user._id,
          dish: req.params.id,
          ...req.body,
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
  })
  .delete(isAuthenticated, (req, res, next) => {
    Orders.deleteMany({ user: req.user._id, dish: req.params.id })
      .then((result) => {
        console.log(new Date(result[0].timeToCome));
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(result);
        next();
      })
      .catch((err) => next(err));
  });

orderRouter.route("/all").get(isAuthenticated, (req, res, next) => {
  Orders.find({ user: req.user._id })
    .then((orders) => {
      res.statusCode = 200;
      res.contentType = "application/json";
      res.json(orders);
      next();
    })
    .catch((err) => next(err));
});

orderRouter
  .route("/")
  .get(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
    const lounge = await lounges.findOne({ loungeAdmin: req.user._id });
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
  });

module.exports = orderRouter;
