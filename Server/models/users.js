const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
	email: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Invalid Email format");
			}
		},
	},
	firstname: {
		type: String,
		required: true,
		validate(value) {
			if (!/^[a-z ,.'-]+$/i.test(value)) {
				throw new Error(`Invalid First Name Format`);
			}
		},
	},
	lastname: {
		type: String,
		required: true,
		validate(value) {
			if (!/^[a-z ,.'-]+$/i.test(value)) {
				throw new Error(`Invalid Last Name Format`);
			}
		},
	},
	role: {
		type: [String],
		default: ["user"],
	},
	isactivated: {
		type: Boolean,
		default: true,
	},
	profileImage: {
		type: String,
		default: "",
	},
});

// User.plugin(passportLocalMongoose, { usernameField: "email" }); with options
User.plugin(passportLocalMongoose);

const Users = mongoose.model("user", User);

module.exports = Users;
