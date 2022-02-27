const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");

// Login
router.post("/login", AuthController.login);

// Logout
module.exports = router;
