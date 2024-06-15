const express = require("express");
const {
  register,
  login,

  getAllUsers,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);
// router.get("/:userId", getUserById);

module.exports = router;
