const roleService = require("../services/role.services");
const userService = require("../services/user.services");
const catchAsync = require("../utils/asyncHandler");
const { alreadyExists, isFound } = require("../utils/checks");

const createRole = catchAsync(async (req, res, next) => {
	const role = await roleService.getRoleByName(req.body.name);

	alreadyExists(role, `Role with name ${req.body.name} already exists`);

	const newRole = await roleService.createRole(req);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(newRole);
});

const getRoleById = catchAsync(async (req, res, next) => {
	const role = await roleService.getRoleById(req.params.roleId);
	isFound(role, `Role with id ${req.params.roleId} not found`);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(role);
});

const getRoleByName = catchAsync(async (req, res, next) => {
	const role = await roleService.getRoleByName(req.params.name);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(role);
});

const getAllRoles = catchAsync(async (req, res, next) => {
	const roles = await roleService.getAllRoles();
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(roles);
});

const getRolesOfUser = catchAsync(async (req, res, next) => {
	const roles = await userService.getRolesOfUser(req.user.userId);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(roles);
});

const updateRole = catchAsync(async (req, res, next) => {
	const role = await roleService.updateRole(req.params.roleId, req.body);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(role);
});

const deleteRole = catchAsync(async (req, res, next) => {
	const role = await roleService.deleteRole(req.params.roleId);
	res.statusCode = 200;
	res.contentType = "application/json";
	res.json(role);
});

module.exports = {
	createRole,
	getRoleById,
	getRoleByName,
	getAllRoles,
	updateRole,
	deleteRole,
};
