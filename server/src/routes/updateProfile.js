const express = require("express");
const multer = require("multer");
const path = require("path");
const USER = require("../modelschemas/userschema");
const { upload } = require("../helpers/filehelper");
const Authenticate = require("../middleware/authenticate");
const router = express.Router();

// Update profile API
router.put(
  "/update-profile",
  upload.single("profile"),
  Authenticate,
  async (req, res) => {
    try {
      const {
        name,
        email,
        address,
        phone,
        dev_status,
        languages,
        communication_languages,
        links,
      } = req.body;

      console.log("update", req.body);
      console.log("update profile", req.file);

      const userId = req.userID;
      const user = await USER.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.address = address || user.address;
      user.phone = phone || user.phone;
      user.profile = req.file ? req.file.path : user.profile; // Update profile image

      // Update coding skills
      if (user.coding.length === 0) {
        user.coding.push({
          dev_status,
          languages,
          communication_languages,
          links,
        });
      } else {
        user.coding[0].dev_status = dev_status || user.coding[0].dev_status;
      }
      console.log(user);

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
