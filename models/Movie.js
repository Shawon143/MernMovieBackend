const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String, require: true },
  category: { type: String, require: true },
  releaseDate: { type: Date },
  videoLink: { type: String, required: true },
  coverImage: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Movie = mongoose.model("Moviee", movieSchema);
module.exports = Movie;
