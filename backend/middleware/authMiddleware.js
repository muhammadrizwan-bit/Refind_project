
const jwt = require("jsonwebtoken");

 const protect = (req, res, next) => {
  try {
    const token = req.cookies.refind_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again.",
    });
  }
};

module.exports = {protect}
