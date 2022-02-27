const express = require("express");

const {
  verifyAccessToken,
  verifyTokenAndAdmin,
} = require("../helpers/jwt_helper");
const UserController = require("../controllers/User.controller");
const router = express.Router();

// Add
router.post("/", verifyAccessToken, verifyTokenAndAdmin, UserController.add);

// Get All
router.get("/", verifyAccessToken, verifyTokenAndAdmin, UserController.getAll);

//Get by id
router.get(
  "/:id",
  verifyAccessToken,
  verifyTokenAndAdmin,
  UserController.getById
);
module.exports = router;
