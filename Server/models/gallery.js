const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  object: {
    type: mongoose.Schema.Types.ObjectId,
  },
  image: {
    type: String,
    default: "",
  },
  priorityNumber: {
    type: Number,
    default: 1,
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
