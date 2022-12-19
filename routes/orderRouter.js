const express = require('express');
const orderRouter = express.Router();
const Dishes = require('../models/dishes');
const bodyParser = require('body-parser');
const {isAuthenticate, verifyAdmin} = require('../authenticate/authenticate');
const Orders = require('../models/orders');

orderRouter.use(bodyParser.json());
orderRouter.use(express.urlencoded({extended:true}));

orderRouter.route('/:id')
.post((req,res,next) => {
    if (!req.isAuthenticated()){
      return res.send("Please signin first")
        // res.redirect("GET:localhost://3000/signin")
    }
    Orders.create({user_id:req.user._id, dish_id:req.params.id, ...req.body})
    .then(order => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(order);
        next()
    })
    .catch(err => next(err))
});

orderRouter.route('/')
.get(verifyAdmin,(req, res, next) => {
    Orders.find({})
    .then(orders => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(orders);
        next();
    })
    .catch(err => next(err))
})


module.exports = orderRouter;

