
const Item = require("../models/Items");
const imagekit = require("../config/imagekit");

// Create Lost or Found Item
const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      description,
      location,
      date,
      reporterName,
      reporterContact,
    } = req.body;

    // Validate required fields
    if (
      !type ||
      !title ||
      !category ||
      !description ||
      !location ||
      !date ||
      !reporterName ||
      !reporterContact
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Validate item type
    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Item type must be lost or found.",
      });
    }

    if (
      typeof reporterName !== "string" ||
      typeof reporterContact !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid reporter name and contact number.",
      });
    }

    const normalizedReporterName = reporterName.trim();
    const normalizedReporterContact = reporterContact.trim();

    if (!normalizedReporterName || normalizedReporterName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid reporter name (up to 100 characters).",
      });
    }

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedReporterContact)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid international contact number, including country code.",
      });
    }

    let imageUrl = "";

    // Upload image to ImageKit if an image is provided
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/refind/items",
      });

      imageUrl = uploadResponse.url;
    }

    // Create item in MongoDB
    const item = await Item.create({
      userId: req.user.id,
      type,
      title,
      category,
      description,
      location,
      date,
      imageUrl,
      reporterName: normalizedReporterName,
      reporterContact: normalizedReporterContact,
    });

    return res.status(201).json({
      success: true,
      message: `${type} item reported successfully.`,
      item,
    });

  } catch (error) {
    console.error("Create Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create item.",
      error: error.message,
    });
  }
};


// Get All Items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalItems: items.length,
      items,
    });

  } catch (error) {
    console.error("Get Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch items.",
    });
  }
};


// Get Single Item
const getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("userId", "name");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });

  } catch (error) {
    console.error("Get Single Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch item.",
    });
  }
};


// Get Logged-in User's Items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalItems: items.length,
      items,
    });

  } catch (error) {
    console.error("Get My Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your items.",
    });
  }
};


// Export Controller Functions
module.exports = {
  createItem,
  getAllItems,
  getSingleItem,
  getMyItems,
};
