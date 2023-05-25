require("dotenv").config();
const passport = require("passport");
const Users = require("../models/users");
const LocalStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
passport.use(
	new jwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRETE,
		},
		(payload, done) => {
			console.log(payload);
			Users.findOne({ _id: payload.id }, (err, user) => {
				if (err) {
					return done(err, false);
				} else if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}
	)
);

const verifyToken = passport.authenticate("jwt", { session: false });

const verifyAdmin = (req, res, next) => {
	if (req?.user?.role?.indexOf("admin") != -1) {
		return next();
	}
	const err = new Error("Unauthorized Access");
	res.statusCode = 403;
	res.contentType = "application/json";
	next(err);
};

const verifyLoungeAdmin = (req, res, next) => {
	if (!req?.user?.isactivated) {
		res.statusCode = 200;
		res.send(
			"This account is not ready for use. Please wait until it is activated"
		);
	} else if (req?.user?.role?.indexOf("loungeadmin") == -1) {
		const err = new Error("Unauthorized Access");
		res.statusCode = 403;
		res.contentType = "application/json";
		return next(err);
	}
	next();
};

const isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		var err = new Error("You are not authenticated!");
		err.status = 401;
		next(err);
	} else {
		next();
	}
};

module.exports = {
	verifyToken,
	isAuthenticated,
	verifyAdmin,
	verifyLoungeAdmin,
};
