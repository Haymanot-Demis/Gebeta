const Dishes = require("../models/dish.model");

const getAllDishes = async (offset, limit) => {
	const dishes = await Dishes.find({}).skip(offset).limit(limit);
	return dishes;
};

const getDish = async (dishId) => {
	const dish = await Dishes.findById(dishId);
	return dish;
};
// TODO: filter need some work
const getDishes = async (filter, offset, limit) => {
	const dishes = await Dishes.find(filter).skip(offset).limit(limit);
	return dishes;
};

const createDish = async (dish) => {
	console.log("create", dish);
	const newDish = await Dishes.create(dish);
	console.log("created", newDish);
	return newDish;
};

const updateDish = async (dishId, update) => {
	const updatedDish = await Dishes.findByIdAndUpdate(
		dishId,
		{ $set: update },
		{ new: true }
	);
	return updatedDish;
};

const deleteDish = async (dishId) => {
	const deletedDish = await Dishes.findByIdAndDelete(dishId);
	return deletedDish;
};

const deleteManyDish = async (filter) => {
	const result = await Dishes.deleteMany(filter);
	return result;
};

const exists = async (condition) => {
	return await Dishes.exists(condition);
};

const count = async (query) => {
	return await Dishes.countDocuments(query);
};

module.exports = {
	getAllDishes,
	getDish,
	getDishes,
	createDish,
	updateDish,
	deleteDish,
	deleteManyDish,
	exists,
	count,
};
