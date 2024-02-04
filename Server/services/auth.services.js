const httpStatus = require("http-status");
const Users = require("../models/users");
const { compare } = require("../utils/auth");
const { ApiError } = require("../utils/apiError");

const loginWithEmailAndPassword = async (email, password) => {
	const user = await Users.findOne({ email });
	const isPasswordMathced = await compare(password, user?.password);

	if (!user || !isPasswordMathced) {
		throw ApiError(httpStatus.UNAUTHORIZED, "Ivalid Credetial");
	}

	user.password = undefined;
	return user;
};
