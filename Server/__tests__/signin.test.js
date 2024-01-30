const app = require("../index");
const supertest = require("supertest");
const Users = require("../models/users");
const requestWithSupertest = supertest(app);
const passport = require("passport");

describe("Authentication", () => {
	describe("Post to Login", () => {
		var user = {
			username: "haymanot.demis.belay@gmail.com",
			firstname: "haymanot",
			lastname: "demis",
			password: "12345678",
		};
		var mockedAuth;

		beforeEach(() => {
			mockedAuth = jest.spyOn(passport, "authenticate");
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		describe("Test 1: With valid username and password", () => {
			test("Expected 200 response, user with jwt token", async () => {
				mockedAuth.mockImplementation(async (auth_type, callback) => {
					await callback(null, new Users(user));
					return (req, res, next) => {
						next();
					};
				});

				const response = await requestWithSupertest.post("/users/signin").send({
					username: "haymanot.demis.belay@gmail.com",
					password: "12345678",
				});

				expect(mockedAuth).toHaveBeenCalled();
				expect(response.statusCode).toBe(200);
				expect(response.type).toEqual("application/json");
				expect(response.body).toHaveProperty("token");
			}, 10000);
		});

		describe("Test 2: With valid username and invalid password", () => {
			test("Expected 401 response, invalid credential", async () => {
				mockedAuth.mockImplementation(async (auth_type, callback) => {
					await callback(null, null, {
						message: "Username or Password Mismatch",
					});
					return (req, res, next) => {
						next();
					};
				});

				const response = await requestWithSupertest.post("/users/signin").send({
					username: "haymanot.demis.belay@gmail.com",
					password: "123456789",
				});

				expect(response.statusCode).toBe(401);
				expect(response.type).toEqual("application/json");
				expect(response.body.success).toBe(false);
				expect(response.body).toHaveProperty("info");
				expect(jest.isMockFunction(mockedAuth)).toBe(true);
				expect(mockedAuth).toHaveBeenCalled();
			}, 10000);
		});

		describe("Test 3: With invalid username and valid password", () => {
			test("Expected 401, invalid credential", async () => {
				mockedAuth.mockImplementation((auth_type, callback) => {
					callback(null, null, {
						message: "Username or Password Mismatch",
					});
					return (req, res, next) => {
						next();
					};
				});

				const response = await requestWithSupertest.post("/users/signin").send({
					username: "haymanot.demis.belay1@gmail.com",
					password: "12345678",
				});

				expect(response.statusCode).toBe(401);
				expect(response.type).toEqual("application/json");
				expect(response.body.success).toBe(false);
				expect(response.body).toHaveProperty("info");
				expect(jest.isMockFunction(mockedAuth)).toBe(true);
				expect(mockedAuth).toHaveBeenCalled();
			}, 10000);
		});

		describe("Test 4: With invalid username and invalid password", () => {
			test("Expected 401, invalid credential", async () => {
				mockedAuth.mockImplementation((auth_type, callback) => {
					callback(null, null, {
						message: "Username or Password Mismatch",
					});
					return (req, res, next) => {
						next();
					};
				});

				const response = await requestWithSupertest.post("/users/signin").send({
					username: "haymanot.demis.belay1@gmail.com",
					password: "123456789",
				});

				expect(response.statusCode).toBe(401);
				expect(response.type).toEqual("application/json");
				expect(response.body.success).toBe(false);
				expect(response.body).toHaveProperty("info");
				expect(jest.isMockFunction(mockedAuth)).toBe(true);
				expect(mockedAuth).toHaveBeenCalled();
			}, 10000);
		});
	});
});
