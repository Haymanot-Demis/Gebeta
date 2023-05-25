const app = require("../index");
const supertest = require("supertest");
const Users = require("../models/users");
const requestWithSupertest = supertest(app);
const passport = require("passport");

describe("Post to Login", () => {
	var user = {
		username: "username@gmail.com",
		firstname: "firstname",
		lastname: "lastname",
		password: "password",
	};
	describe.only("Test 1: With valid username and password", () => {
		test("Expected 200 response, user with jwt token", async () => {
			console.log(typeof passport.authenticate);
			const mockedAuth = jest.spyOn(passport, "authenticate");
			mockedAuth.mockImplementation((...args) => {
				const [auth_type, callback] = args;

				console.log(auth_type);
				console.log(callback);
				callback(null, new Users(user), null);
			});

			const response = await requestWithSupertest.post("/users/signin").send({
				username: "haymanot.demis.belay@gmail.com",
				password: "123456789",
			});

			expect(response.statusCode).toBe(200);
			expect(response.type).toEqual("application/json");
			expect(response.body).toHaveProperty("token");
			jest.restoreAllMocks();
		}, 10000);
	});

	describe("Test 2: With valid username and invalid password", () => {
		test("Expected 401 response, invalid credential", async () => {
			const mockedAuth = jest
				.spyOn(passport, "authenticate")
				.mockImplementation((auth_type, callback) => {
					callback(new Error("Username or Password Mismatch"), new Users(user));
				});
			const response = await requestWithSupertest.post("/users/signin").send({
				username: "haymanot.demis.belay@gmail.com",
				password: "12345678",
			});

			expect(response.statusCode).toBe(401);
			expect(response.type).toEqual("application/json");
			expect(response.body.success).toBe(false);
			expect(response.body).toHaveProperty("info");
			expect(jest.isMockFunction(mockedAuth)).toBe(true);
			expect(mockedAuth).toHaveBeenCalled();
			jest.restoreAllMocks();
		}, 10000);
	});

	describe("Test 3: With invalid username and valid password", () => {
		test("Expected 401, invalid credential", async () => {
			const mockedAuth = jest
				.spyOn(passport, "authenticate")
				.mockImplementation((auth_type, callback) => {
					callback(new Error("Username or Password Mismatch"), new Users(user));
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

	describe("Test 4: With invalid username and valid password", () => {
		test("Expected 401, invalid credential", async () => {
			const mockedAuth = jest
				.spyOn(passport, "authenticate")
				.mockImplementation((auth_type, callback) => {
					callback(new Error("Username or Password Mismatch"), new Users(user));
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
