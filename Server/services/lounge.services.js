const Lounge = require("../models/lounge.model");

const getLoungeById = async (loungeId) => {
	const lounge = await Lounge.findById(loungeId);
	return lounge;
};

const getLoungesByAdmin = async (adminId) => {
	const lounges = await Lounge.find({ loungeAdmin: adminId });
	return lounges;
};

const getLoungeByName = async (loungeName) => {
	const lounge = await Lounge.findOne({ name: loungeName });
	return lounge;
};

const getAllLounges = async () => {
	const lounges = await Lounge.find({});
	return lounges;
};

const getLounges = async (filter) => {
	const lounges = await Lounge.find(filter);
	return lounges;
};

const createLounge = async (lounge) => {
	const newLounge = await Lounge.create(lounge);
	return newLounge;
};

const updateLounge = async (loungeId, updatedLounge) => {
	const updated = await Lounge.findByIdAndUpdate(
		loungeId,
		{ $set: updatedLounge },
		{ new: true }
	);
	return updated;
};

const deleteLounge = async (loungeId) => {
	const deleted = await Lounge.findByIdAndDelete(loungeId);
	return deleted;
};

const deleteMany = async (filter) => {
	const deleted = await Lounge.deleteMany(filter);
	return deleted;
};

const exists = async (filter) => {
	return await Lounge.exists(filter);
};

module.exports = {
	getLoungeById,
	getLoungesByAdmin,
	getLoungeByName,
	getAllLounges,
	getLounges,
	createLounge,
	updateLounge,
	deleteLounge,
	deleteMany,
	exists,
};
