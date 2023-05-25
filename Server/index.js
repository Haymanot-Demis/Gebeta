require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./authenticate/config");
const passport = require("passport");
const expressSession = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(expressSession);
// const FileStore = require("session-file-store")(expressSession);
// const authenticate = require("./authenticate/authenticate");
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
const commentsRouter = require("./routes/commentsRouter");
const galleryRouter = require("./routes/galleryRouter");
const Users = require("./models/users");

//Connecting server to MongoDB
// .connect("mongodb://127.0.0.1:27017/haymanot")

mongoose
	.connect(config.mongodbURL)
	.then(() => {
		console.log("Database connected Successfully");
	})
	.catch((err) => console.log(err));

const sessionStore = new MongoDBStore({
	uri: config.mongodbURL,
	collection: "session",
	databaseName: "haymanot",
});
//built in middlewares
// app.use(cookieParser("hayme"));

// app.engine("handlebars", hbs.engine({ extname: ".hbs" }));
// app.set("view engine", "handlebars");
// app.set("views", path.join(__dirname, "views"));
var whitelist = ["https://aastu-gebeta-w24u.onrender.com"];
var corsOptions = {
	origin: function (origin, callback) {
		console.log("origin", origin);
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	expressSession({
		name: process.env.SESSION_NAME,
		secret: process.env.SECRETE,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// user defined middlewares
app.use("/dishes", dishRouter);
app.use("/lounges", loungeRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/comments", commentsRouter);
app.use("/gallery", galleryRouter);

app.get("/", (req, res, next) => {
	res.contentType = "application/json";
	res.statusCode = 200;
	res.json({ greating: "Welcome" });
});

module.exports = app;
