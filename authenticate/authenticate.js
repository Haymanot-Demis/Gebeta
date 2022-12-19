const passport = require('passport');
const Users = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

const verifyAdmin = (req, res, next) => {
    if (req.user.admin){
        return next()
    }
    const err = new Error("Unauthorized Access");
    res.statusCode = 403
    res.contentType = 'application/json';
    next(err);
}

const isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        var err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
    }else{
      next();
    }
}

module.exports = {isAuthenticated, verifyAdmin}