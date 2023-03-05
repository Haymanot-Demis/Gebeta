const passport = require("passport");
const Users = require("../models/users");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

const verifyAdmin = (req, res, next) => {
  return next();
  if (req?.user?.systemAdmin) {
    return next();
  }
  const err = new Error("Unauthorized Access");
  res.statusCode = 403;
  res.contentType = "application/json";
  next(err);
};

const verifyLoungeAdmin = (req, res, next) => {
  /*if (!req?.user?.isactivated) {
    res.statusCode = 200;
    res.send(
      "This account is not ready for use. Please wait until it is activated"
    );
  } else if (!req?.user?.loungeAdmin) {
    const err = new Error("Unauthorized Access");
    res.statusCode = 403;
    res.contentType = "application/json";
    return next(err);
  }*/
  next();
};

const isAuthenticated = (req, res, next) => {
  return next();
  if (!req.isAuthenticated()) {
    var err = new Error("You are not authenticated!");
    err.status = 401;
    next(err);
  } else {
    next();
  }
};

module.exports = { isAuthenticated, verifyAdmin, verifyLoungeAdmin };
