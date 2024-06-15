const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const movieController = require("../controllers/movieController");

// POST upload movie
router.post(
  "/upload",
  auth,
  admin,
  upload.single("coverImage"),
  movieController.uploadMovie
);

// GET all movies
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);
router.delete("/:id", auth, admin, movieController.deleteMovie);
router.put(
  "/:id",
  auth,
  admin,
  upload.single("coverImage"),
  movieController.updateMovie
);

module.exports = router;
