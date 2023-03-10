require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./authenticate/config");
const passport = require("passport");
const expressSession = require("express-session");
const authenticate = require("./authenticate/authenticate");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const ejs = require("ejs");
const { engine } = require("express-handlebars");
const cors = require("cors");

// Importing Routes
const dishRouter = require("./routes/dishesRouter");
const loungeRouter = require("./routes/loungeRouter");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRouter");

//Connecting server to MongoDB
mongoose
  .connect(config.mongodbURL)
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch((err) => console.log(err));

//built in middlewares
// app.use(cookieParser("hayme"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", hbs.engine({ extname: ".hbs" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  expressSession({
    name: process.env.SESSION_NAME,
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// user defined middlewares
app.use("/dishes", dishRouter);
app.use("/lounges", loungeRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/login", (req, res, next) => {
  res.render("login");
});

app.get("/users/signup", (req, res, next) => {
  res.render("signup");
});

app.get("/users/logout", (req, res, next) => {
  res.render("logout");
});

// user auth
// app.use((req, res, next) => {
//     if(!req.isAuthenticated()){
//         var err = new Error('You are not authenticated!');
//         err.status = 403;
//         next(err);
//     }else{
//       next();
//     }
// })

app.get("/home", (req, res) => {
  res.render("login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
