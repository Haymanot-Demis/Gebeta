const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Dishes = require("./dishes");
const Lounges = require("./lounges");

const commonSchema = {
	image: {
		type: String,
		default: "",
	},
	priorityNumber: {
		type: Number,
		default: 1,
	},
};
const dishGallerySchema = new Schema(
	{
		object: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Dishes,
		},
		...commonSchema,
	},
	{
		timestamps: true,
	}
);
const loungeGallerySchema = new Schema(
	{
		object: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Lounges,
		},
		...commonSchema,
	},
	{
		timestamps: true,
	}
);

const LoungesGallery = mongoose.model("LoungesGallery", loungeGallerySchema);
const DishesGallery = mongoose.model("DishesGallery", dishGallerySchema);

module.exports = { LoungesGallery, DishesGallery };
