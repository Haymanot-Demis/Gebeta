require("dotenv").config();
const app = require("../index");
const supertest = require("supertest");
const { generate } = require("randomstring");
const Users = require("../models/users");
const Tokens = require("../models/token");
const requestWithSupertest = supertest(app);
const crypto = require("crypto");
const bcrypt = require("bcrypt");

describe("Forgot Password", () => {
	var user = {
		username: "haymanot.demis.belay@gmail.com",
		firstname: "haymanot",
		lastname: "demis",
		password: "12345678",
		email: "haymanot.demis.belay@gmail.com",
	};
	var mockedUserFindOne;
	var mockedTokenFindOne;
	var mockedDeleteToken;
	var mockedCreateToken;
	var mockedSetPass;
	var InvalidToken;
	var tokenObj;
	var token;
	var hashedToken;

	beforeAll(async () => {
		token = crypto.randomBytes(32).toString("hex");
		hashedToken = await bcrypt.hash(token, Number(process.env.SALT));
		console.log("Compare result", await bcrypt.compare(token, hashedToken));

		tokenObj = { token };
		InvalidToken = { token: token + token };
	});

	beforeEach(() => {
		mockedUserFindOne = jest.spyOn(Users, "findOne");
		mockedTokenFindOne = jest.spyOn(Tokens, "findOne");
		mockedDeleteToken = jest.spyOn(Tokens, "deleteMany");
		mockedSetPass = jest.spyOn(Users.prototype, "setPassword");

		mockedCreateToken = jest
			.spyOn(Tokens, "create")
			.mockImplementation((userObj) => {
				return Promise.resolve(new Tokens(tokenObj));
			});

		mockedDeleteToken.mockReturnValue(null);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	// mockedTokenFindOne.mockImplementation(() => {});
	// mockedTokenFindOne.mockImplementation(() => {
	// 	return Promise.resolve(new Tokens(InvalidToken));
	// });

	describe("Reset Password Token", () => {
		describe("Test 1: Given Valid Email Input", () => {
			test("Should return password reset token via the provided email, 200 statusCode and email envelop", async () => {
				mockedUserFindOne.mockImplementation((userObj) => {
					return Promise.resolve(new Users(user));
				});
				const response = await requestWithSupertest
					.post("/users/account/resetPasswordRequest")
					.send({
						email: user.email,
					});

				expect(response.statusCode).toBe(200);
				expect(mockedUserFindOne).toHaveBeenCalled();
				expect(mockedDeleteToken).toHaveBeenCalled();
			});
		});

		describe("Test 2: Given Invalid Email Input", () => {
			test("Should return 404 statusCode and User not found err message", async () => {
				mockedUserFindOne.mockImplementation((userObj) => {
					return Promise.resolve(null);
				});

				const response = await requestWithSupertest
					.post("/users/account/resetPasswordRequest")
					.send({
						email: "x" + user.email,
					});

				expect(response.statusCode).toBe(404);
				expect(response.text).toEqual("User not found");
				expect(mockedUserFindOne).toHaveBeenCalled();
			});
		});
	});

	describe("Reset Password", () => {
		describe("Given valid token", () => {
			test("Should return email envelop for success reset and 200 statusCode", async () => {
				const bcryptMock = jest.spyOn(bcrypt, "compare");

				mockedUserFindOne.mockImplementation((userObj) => {
					return Promise.resolve(new Users(user));
				});

				mockedTokenFindOne.mockImplementation(() => {
					return Promise.resolve(new Tokens({ token: hashedToken }));
				});

				mockedSetPass.mockImplementation((newPassword, callback) => {
					callback(null, new Users(user));
				});
				const res = await requestWithSupertest
					.post("/users/account/resetPassword")
					.send({
						user_id: "645b9bed15f9bb3a33d7a52e",
						token: token,
						password: "123456789",
					});

				// console.log(res);
				expect(bcryptMock).toHaveBeenCalled();
				expect(mockedUserFindOne).toHaveBeenCalled();
				expect(mockedSetPass).toHaveBeenCalled();
				expect(mockedTokenFindOne).toHaveBeenCalled();

				expect(res.statusCode).toBe(200);
			});
		});
	});
});
