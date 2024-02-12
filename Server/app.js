require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./config/config");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Importing Routes
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/userRouter");
const roleRouter = require("./routes/role.route");
const dishRouter = require("./routes/dishesRouter");
const loungeRouter = require("./routes/lounge.route");
const orderRouter = require("./routes/orderRouter");
const commentsRouter = require("./routes/commentsRouter");
const galleryRouter = require("./routes/galleryRouter");

mongoose.set("strictQuery", true);
mongoose
	.connect(config.mongodbURL, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Database connected Successfully");
	})
	.catch((err) => console.log(err));

app.use(cookieParser("hayme"));

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

// routes
// TODO: paginating get many routes
app.use("/auth", authRouter);
app.use("/roles", roleRouter);
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
