const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

// Register
router.post("/register", AuthController.register);
// Login
router.post("/login", AuthController.login);

// Logout
module.exports = router;
