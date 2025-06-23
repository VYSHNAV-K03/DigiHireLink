const multer = require("multer");
const path = require("path");

const cookieParser = require("cookie-parser"); //this is used for getting req.cookies in middleware otherwise we dont get cookies in req in middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // null returns when error comes otherwise the folder name
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
    console.log("storage");
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
