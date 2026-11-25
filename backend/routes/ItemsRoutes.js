
const express = require("express");

const items = require("../controllers/itemsControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js");

const itemsRouter = express.Router();

// Create Lost or Found Report with optional image
itemsRouter.post(
  "/create",
  protect,
  upload.single("image"),
  items.createItem
);

// Get All Items
itemsRouter.get("/all", items.getAllItems);

// Get Logged-in User's Items
itemsRouter.get("/my-items", protect, items.getMyItems);

// Get Single Item
itemsRouter.get("/:id", items.getSingleItem);

module.exports = { itemsRouter };
