const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = require("./users");

const loungeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: String,
    default: "",
  },
  longitude: {
    type: String,
    default: "",
  },
  loungeAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
  },
  image: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("lounge", loungeSchema);
