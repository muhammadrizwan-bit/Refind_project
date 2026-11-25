
const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    reporterName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    reporterContact: {
      type: String,
      required: true,
      trim: true,
      maxlength: 16,
      match: /^\+[1-9]\d{7,14}$/,
    },

    status: {
      type: String,
      enum: ["active", "claimed", "returned", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item
