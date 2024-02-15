const httpStatus = require("http-status");
const Roles = require("../models/role.model");
const { isFound } = require("../utils/checks");

const createRole = async (req) => {
	const { name, description } = req.body;
	const role = await Roles.create({
		name,
		description,
	});
	return role;
};

const getRoleById = async (roleId) => {
	const role = await Roles.findById(roleId);
	return role;
};

const getRoleByName = async (name) => {
	const role = await Roles.findOne({ name: name });
	return role;
};

const getAllRoles = async () => {
	const roles = await Roles.find({});
	return roles;
};

const getRoles = async (filter) => {
	const roles = await Roles.find(filter);
	return roles;
};

const updateRole = async (roleId, update) => {
	const role = await Roles.findById(roleId);
	const updatedRole = await Roles.findOneAndUpdate(
		{
			_id: roleId,
		},
		update,
		{
			new: true,
		}
	);

	return updatedRole;
};

const deleteRole = async (roleId) => {
	const role = await Roles.findById(roleId);
	const deleteResult = await Roles.findOneAndDelete({
		_id: roleId,
	});

	return deleteResult;
};

module.exports = {
	createRole,
	getRoleById,
	getRoleByName,
	getAllRoles,
	getRoles,
	updateRole,
	deleteRole,
};
