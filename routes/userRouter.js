require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const authenticate = require("../authenticate/authenticate");
const passport = require("passport");
const Users = require("../models/users");
const Tokens = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

userRouter.use(bodyParser.json());

userRouter.route("/signup").post((req, res, next) => {
  Users.register(req.body, req.body.password, (err, user) => {
    if (err) {
      return next(err);
    }
    const authenticate = Users.authenticate();
    authenticate(req.body.username, req.body.password, (err, result) => {
      if (err) {
        return next(err);
      }

      if (user.loungeAdmin) {
        user.isactivated = false;
      }
      user
        .save()
        .then((user) => {
          res.statusCode = 200;
          res.contentType = "application/json";
          return res.json({
            success: true,
            status: "Successfully Resgistered",
            user,
          });
        })
        .catch((err) => {
          next(err);
        });
    });
  });
});

// userRouter.route('/signin')
// .post(passport.authenticate('local', {failureRedirect:'/'}), (req, res, next) => {
//     console.log(req.user,"after signin");
//     res.statusCode = 200;
//     res.contentType = 'application/json';
//     return res.json({"success" : true, "status" : "Login Successfully"});
//     next()
// });

userRouter.route("/signin").post((req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.contentType = "application/json";
      res.json({ success: false, status: "Login Failed", info });
    } else {
      //   if (!user.isactivated) {
      //     res.statusCode = 200;
      //     return res.send(
      //       "This account is not ready for use. Please wait until it is activated"
      //     );
      //   }
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.contentType = "application/json";
          return res.json({ success: false, status: "Login Failed", err });
        }

        res.statusCode = 200;
        res.contentType = "application/json";
        return res.json({ success: true, status: "Login Successfully" });
      });
    }
  })(req, res, next);
});

userRouter.route("/logout").get((req, res, next) => {
  req.logOut();
  res.redirect("/");
});

userRouter
  .route("/account/changePassword")
  .post(authenticate.isAuthenticated, (req, res, next) => {
    Users.findByUsername(req.user.username)
      .then((user) => {
        if (!user) {
          res.statusCode = 401;
          res.contentType = "text/plain";
          res.send("User is found");
          return next();
        }
        console.log(user);
        user.changePassword(
          req.body.oldPassword,
          req.body.newPassword,
          (err, result) => {
            if (err) {
              res.statusCode = 400;
              res.contentType = "application/json";
              res.json(err);
              return next(err);
            }
            res.statusCode = 200;
            res.contentType = "text/html";
            return res.send(result);
          }
        );
      })
      .catch((err) => next(err));
  });

userRouter.route("/account/resetPassword").post((req, res, next) => {
  Users.findOne({ _id: req.body.user_id }).then(async (user) => {
    const resetToken = await Tokens.findOne({ user_id: ObjectId(user._id) });
    if (!resetToken) {
      res.statusCode = 403;
      console.log("token not found");
      const err = new Error("Invalid or expired password reset token");
      return next(err);
    }
    const isValidToken = await bcrypt.compare(req.body.token, resetToken.token);
    if (!isValidToken) {
      res.statusCode = 403;
      console.log("Invalid or expired ");
      const err = new Error("Invalid or expired password reset token");
      return next(err);
    }
    user.setPassword(req.body.password, async (err, result) => {
      if (err) {
        res.statusCode = 400;
        res.contentType = "application/json";
        res.json(err);
        return next(err);
      }
      await user.save();
      res.statusCode = 200;
      res.contentType = "text/html";
      return res.send(result);
    });
  });
});

userRouter.route("/account/resetPasswordRequest").post((req, res, next) => {
  Users.findOne({ email: req.body.email }).then(async (user) => {
    if (!user) {
      res.statusCode = 404;
      res.send("User not found");
      return next();
    }

    const res = await Tokens.deleteMany({ user_id: ObjectId(user._id) });
    console.log(res);
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, Number(process.env.SALT));
    const userToken = await Tokens.create({
      user_id: user._id,
      token: hashedToken,
    });
    console.log(userToken);
    const transorter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "haymedin21@gmail.com",
        pass: "zroqmpmvrsuartlk",
      },
    });
    transorter.sendMail(
      {
        from: "haymedin21@gmail.com",
        to: user.email,
        subject: "Reset password",
        text: token,
      },
      (err, info) => {
        if (err) {
          console.log("err msg", err.message);
          res.statusCode = 400;
          res.contentType = "application/json";
          res.json(err);
          return next(err);
        }
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(info);
        return next();
      }
    );
  });
});

module.exports = userRouter;
