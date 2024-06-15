// middlewares/auth.js
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("No token, authorization denied");
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).send("Token is not valid");
  }
};

// Middleware to check if user is admin
exports.admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("Access denied");
  }
  next();
};
