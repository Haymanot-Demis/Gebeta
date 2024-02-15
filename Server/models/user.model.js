const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
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
	email: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Invalid Email format");
			}
		},
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Role",
			},
		],
		default: [],
	},
	isactivated: {
		type: Boolean,
		default: false,
	},
	profileImage: {
		type: String,
		default: "",
	},
});

// User.plugin(passportLocalMongoose, { usernameField: "email" }); with options
// User.plugin(passportLocalMongoose);

const Users = mongoose.model("User", User);

module.exports = Users;
