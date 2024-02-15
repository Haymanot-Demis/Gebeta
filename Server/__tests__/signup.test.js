require("dotenv").config();
const app = require("../index");
const supertest = require("supertest");
const mongoose = require("mongoose");
const config = require("../authenticate/config");
const { generate } = require("randomstring");
const Users = require("../models/users");
const requestWithSupertest = supertest(app);

describe("Registration", () => {
	describe("Post to signup", () => {
		var username = generate({ length: 8, charset: "abcABC123" }) + "@gmail.com";
		var users = [];
		var user = {
			username: username,
			firstname: "John",
			lastname: "Doe",
			password: "123456789",
		};
		var mockedRegister;
		var userSave;

		beforeEach(() => {
			mockedRegister = jest.spyOn(Users, "register");
			userSave = jest.spyOn(Users.prototype, "save");
			userSave.mockImplementation(() => {
				return Promise.resolve(new Users(user));
			});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		describe("All valid inputs", () => {
			test("Expected 200 response with registered user", async () => {
				mockedRegister.mockImplementation((userData, password, callback) => {
					users.push({ ...userData, password: "hashed password " + password });
					callback(null, new Users(users[users.length - 1]));
				});

				const response = await requestWithSupertest
					.post("/users/signup")
					.send(user);

				expect(response.statusCode).toBe(200);
				expect(response.type).toEqual("application/json");
				expect(response.body).toHaveProperty("user");
				expect(response.body.success).toBe(true);
				expect(response.body.status).toBe("Successfully Registered");
				expect(jest.isMockFunction(mockedRegister)).toBe(true);
				expect(mockedRegister).toHaveBeenCalled();
				expect(userSave).toBeCalled();
			}, 10000);
		});

		describe("Already registered username", () => {
			test("Expected 500 response", async () => {
				mockedRegister.mockImplementation((userData, password, callback) => {
					const user_ = users.find((_user) => {
						return _user.username == userData.username;
					});
					if (user_) {
						callback(new Error("Username is already registered"), null);

						return;
					}
					callback(null, new Users(users[users.length - 1]));
				});

				const response = await requestWithSupertest
					.post("/users/signup")
					.send(user);

				expect(response.statusCode).toBe(500);
				expect(response.type).toEqual("text/html");
				expect(jest.isMockFunction(mockedRegister)).toBe(true);
				expect(mockedRegister).toHaveBeenCalled();
				expect(mockedRegister).toHaveBeenCalledWith(
					{ email: user.username, ...user },
					user.password,
					expect.any(Function)
				);
				expect(userSave).not.toHaveBeenCalled();
			}, 10000);
		});

		describe("Empty for required field", () => {
			test("Expected 500 response", async () => {
				mockedRegister.mockImplementation((userData, password, callback) => {
					callback(new Error("Password Field missed"), null);
				});

				const response = await requestWithSupertest
					.post("/users/signup")
					.send({ ...user, username: "x" + username, password: "" });

				expect(response.statusCode).toBe(500);
				expect(response.type).toEqual("text/html");
				expect(mockedRegister).toHaveBeenCalled();
				expect(userSave).not.toHaveBeenCalled();
			}, 10000);
		});
	});
});
