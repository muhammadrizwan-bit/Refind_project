
const express = require("express");
const authControllers = require("../controllers/authController")


const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register", authControllers.registerUser);

router.post("/login", authControllers.loginUser);

router.get("/me", protect, authControllers.getCurrentUser);

router.post("/logout", protect, authControllers.logoutUser);

module.exports= router;
