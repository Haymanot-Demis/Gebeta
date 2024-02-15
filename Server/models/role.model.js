const mongoose = require("mongoose");
const Users = require("./user.model");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
});

roleSchema.post("remove", async (role) => {
	await Users.updateMany({ roles: role._id }, { $pull: { roles: role._id } });
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
