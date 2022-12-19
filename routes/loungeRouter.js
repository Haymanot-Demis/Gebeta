const express = require('express');
const loungeRouter = express.Router();
const bodyParser = require('body-parser');
const { verifyAdmin } = require('../authenticate/authenticate');
const Lounges = require('../models/lounges');

loungeRouter.use(bodyParser.json());

loungeRouter.route('/')
.get((req, res, next) =>{
    Lounges.find({})
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
        next()
    })
    .catch(err => next(err))
})
.post(verifyAdmin, (req, res, next) => {
    Lounges.create(req.body)
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
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
    Lounges.deleteMany({})
    .then(result => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(result);
        next()
    })
    .catch(err => next(err))
});

loungeRouter.route('/:id')
.get((req, res, next) => {
    Lounges.find(req.params.id)
    .then(lounge => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounge);
        next()
    })
})
.post(verifyAdmin, (req, res, next) => {
    Lounges.create(req.body)
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
        next()
    })
    .catch(err => next(err))
})
.put(verifyAdmin,(req, res, next) => {
    Lounges.findByIdAndUpdate(req.params.id,
        {
            $set: req.body
        },{new:true}
    ).then(lounge => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounge);
        next()
    })
    .catch(err => next(err))

})
.delete(verifyAdmin, (req, res, next) => {
    Lounges.deleteOne({_id:req.params.id})
    .then(result => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(result);
        next()
    })
    .catch(err => next(err))
})

module.exports = loungeRouter;