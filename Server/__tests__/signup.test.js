require("dotenv").config();
const app = require("../index");
const supertest = require("supertest");
const mongoose = require("mongoose");
const config = require("../authenticate/config");
const { generate } = require("randomstring");
const Users = require("../models/users");
const requestWithSupertest = supertest(app);
const add = () => {
	console.log("add somethings");
};

describe("Home", () => {
	test("GET", async () => {
		const res = await requestWithSupertest.get("/");

		expect(res.statusCode).toBe(200);
		expect(res.type).toMatch("application/json");
		expect(typeof res.body).toEqual("object");
		expect(res.body).toHaveProperty("greating");
	});
});

describe("Mock", () => {
	it("should return null", () => {
		const mockedAdd = jest.fn(add);
		mockedAdd.mockImplementation((a, b) => {
			console.log(a + b);
			return a + b;
		});
		const res = mockedAdd(1, 2);
		expect(res).toBe(3);
		expect(mockedAdd).toBeCalled();
	});
});

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

		describe("All valid inputs", () => {
			test("Expected 200 response with registered user", async () => {
				const mockedRegister = jest.spyOn(Users, "register");
				const userSave = jest
					.spyOn(Users.prototype, "save")
					.mockImplementation(() => {
						return Promise.resolve(new Users(user));
					});
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
				jest.restoreAllMocks();
			}, 10000);
		});

		describe("Already registered username", () => {
			test("Expected 500 response", async () => {
				const mockedRegister = jest.spyOn(Users, "register");
				const userSave = jest
					.spyOn(Users.prototype, "save")
					.mockImplementation(() => {
						return Promise.resolve(new Users(user));
					});

				mockedRegister.mockImplementation((userData, password, callback) => {
					const user_ = users.find((_user) => {
						return _user.username == userData.username;
					});
					if (user_) {
						callback(
							new Error("Username is already registered"),
							new Users(users[users.length - 1])
						);

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
				jest.restoreAllMocks();
			}, 10000);
		});

		describe("Empty for required field", () => {
			test("Expected 500 response", async () => {
				const mockedRegister = jest.spyOn(Users, "register");
				const userSave = jest
					.spyOn(Users.prototype, "save")
					.mockImplementation(() => {
						return Promise.resolve(new Users(user));
					});

				mockedRegister.mockImplementation((userData, password, callback) => {
					callback(
						new Error("Password Field missed"),
						new Users(users[users.length - 1])
					);
				});

				const response = await requestWithSupertest
					.post("/users/signup")
					.send({ ...user, username: "x" + username, password: "" });

				expect(response.statusCode).toBe(500);
				expect(response.type).toEqual("text/html");
				expect(mockedRegister).toHaveBeenCalled();
				expect(userSave).not.toHaveBeenCalled();
				jest.restoreAllMocks();
			}, 10000);
		});
	});
});
