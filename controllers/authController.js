// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body; // Include isAdmin
  try {
    const user = new User({ username, email, password, isAdmin });
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ msg: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Assuming isAdmin is a field in your User schema
      },
    };

    jwt.sign(
      payload,
      "your_jwt_secret",
      { expiresIn: 3600 }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        res.json({ token, isAdmin: user.isAdmin }); // Send token and isAdmin in response
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
