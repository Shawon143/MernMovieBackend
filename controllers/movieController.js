const Movie = require("../models/Movie");
const cloudinary = require("../config/cloudinaryConfig");

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.uploadMovie = async (req, res) => {
  const { title, description, genre, category, releaseDate, videoLink } =
    req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(req.file.buffer);
    });

    const newMovie = new Movie({
      title,
      description,
      genre,
      category,
      releaseDate,
      videoLink,
      coverImage: result.secure_url, // Save Cloudinary URL to database
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie uploaded", movie: newMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMovie = async (req, res) => {
  const { title, description, genre, category, releaseDate, videoLink } =
    req.body;

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(req.file.buffer);
      });
      movie.coverImage = result.secure_url;
    }

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.genre = genre || movie.genre;
    movie.category = category || movie.category;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.videoLink = videoLink || movie.videoLink;

    await movie.save();
    res.json({ message: "Movie updated", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await Movie.deleteOne({ _id: req.params.id });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
