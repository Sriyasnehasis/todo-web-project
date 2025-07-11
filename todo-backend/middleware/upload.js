const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1624345.png
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  cb(null, true); // Allow all file types
};


const upload = multer({ storage, fileFilter });

module.exports = upload;
