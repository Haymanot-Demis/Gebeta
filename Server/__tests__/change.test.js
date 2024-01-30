require("dotenv").config();
const app = require("../index");
const supertest = require("supertest");
const requestWithSupertest = supertest(app);
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const authenticate = require("../authenticate/authenticate");
const passport = require("passport");

const user = {
	_id: "645b9bed15f9bb3a33d7a52e",
	username: "haymanot.demis.belay@gmail.com",
	firstname: "Haymanot",
	lastname: "Demis",
	email: "haymanot.demis.belay@gmail.com",
};

const JWTToken = jwt.sign({ id: user.id }, process.env.SECRETE);

describe("Resetting password", () => {
	var mockedFind;
	var mockedFindOne;
	var mockedChangePass;
	beforeEach(() => {
		mockedFind = jest.spyOn(Users, "findById");
		mockedFindOne = jest.spyOn(Users, "findById");
		mockedChangePass = jest.spyOn(Users.prototype, "changePassword");

		mockedFind.mockImplementation((id) => {
			return Promise.resolve(new Users(user));
		});

		mockedFindOne.mockImplementation((obj, callback) => {
			callback(null, new Users(user));
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
	describe("logged in user, valid current password, valid new password", () => {
		it("should reset password with 200 response", async () => {
			mockedChangePass.mockImplementation(
				(oldPassword, newPassword, callback) => {
					callback(null, new Users(user));
				}
			);
			const result = await requestWithSupertest.get("/dishes");
			console.log(result[0]);
			const res = await requestWithSupertest
				.post("/users/account/changePassword")
				.send({
					oldPassword: "12345678",
					newPassword: "123456789",
				})
				.set("Authorization", `Bearer ${JWTToken}`);

			console.log(res);

			expect(res.statusCode).toBe(200);
			expect(res.type).toEqual("application/json");
			expect(res.body).toHaveProperty("accepted");
			expect(res.body.accepted).toEqual([user.username]);
			expect(jest.isMockFunction(mockedFind)).toBe(true);
			expect(mockedFind).toHaveBeenCalled();
			expect(jest.isMockFunction(mockedChangePass)).toBe(true);
			expect(mockedChangePass).toHaveBeenCalled();
		});
	});
	describe("logged in user, invalid current password", () => {
		it("must return 401", async () => {
			mockedChangePass.mockImplementation(
				(oldPassword, newPassword, callback) => {
					callback(new Error("Incorrect Password"), null);
				}
			);

			const res = await requestWithSupertest
				.post("/users/account/changePassword")
				.send({
					oldPassword: "123456780",
					newPassword: "12345678",
				})
				.set("Authorization", `Bearer ${JWTToken}`);

			expect(res.statusCode).toBe(401);
			expect(res.type).toEqual("application/json");
			expect(res.body).toHaveProperty("msg");
			expect(jest.isMockFunction(mockedFind)).toBe(true);
			expect(mockedFind).toHaveBeenCalled();
			expect(jest.isMockFunction(mockedChangePass)).toBe(true);
			expect(mockedChangePass).toHaveBeenCalled();
		});
	});
});
