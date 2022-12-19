const express = require('express');
const dishRouter = express.Router();
const Dishes = require('../models/dishes');
const bodyParser = require('body-parser');
const { verifyAdmin } = require('../authenticate/authenticate');
const Orders = require('../models/orders');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) =>{
    Dishes.find({})
    .then((dishes => {
            res.statusCode = 200
            res.contentType('application/json');
            res.json(dishes)
            next()
    }))
    .catch(err => next(err))
})
.post(verifyAdmin ,async (req, res, next) => {
    const loungeId = await Orders.findOne({name:req.body.availableIn},{_id:1});
    req.body.availableIn = loungeId
    Dishes.create(req.body)
    .then(dishes => {
        res.statusCode = 200
        res.contentType('application/json');
        res.json(dishes)
        next()
    })
    .catch(err => next(err))
})
.put(verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
    next()
})
.delete(verifyAdmin, (req, res, next) => {
    Dishes.deleteMany({})
    .then(result => {
        res.statusCode = 200
        res.contentType('application/json');
        res.json(result)
        next()
    })
    .catch(err => next(err))
});

dishRouter.route('/:id')
.get((req, res, next) =>{
    Dishes.find({})
    .then((dishes => {
            res.statusCode = 200
            res.contentType('application/json');
            res.json(dishes)
            next()
    }))
    .catch(err => next(err))
})
.post(verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
    .then(dishes => {
        res.statusCode = 200
        res.contentType('application/json');
        res.json(dishes)
        next()
    })
    .catch(err => next(err))
})
.put(verifyAdmin,(req, res, next) => {
    Dishes.findOneAndUpdate({_id:req.params.id},{
        $set:req.body
    }, {
        returnDocument:'after'
    }).then(newDishes => {
        res.statusCode = 200
        res.contentType('application/json');
        res.json(newDishes)
        next()
    })
    .catch(err => next(err))
})
.delete(verifyAdmin, (req, res, next) => {
    Dishes.deleteOne({_id:req.params.id})
    .then(dishes => {
        res.statusCode = 200
        res.contentType('application/json');
        res.json(dishes)
        next()
    })
    .catch(err => next(err))
});

module.exports = dishRouter;