const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Lounges = require("./lounges");
const Users = require("./users");

const commentSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 3,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const dishSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    // select from a datalist
    type: String,
    required: true,
  },
  category: {
    // select from a datalist
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comment: [commentSchema],
  lounge: {
    // select from a datalist
    type: mongoose.Schema.Types.ObjectId,
    ref: Lounges,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
});

const Dishes = mongoose.model("dish", dishSchema);

module.exports = Dishes;
