const express = require("express");
const router = express.Router();
const WorkHistorySchema = require("../modelschemas/WorkHistorySchema");
const Authenticate = require("../middleware/authenticate");
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });


router.get("/:employee_id", async (req, res) => {
  try {
    console.log("get emp history", req.params.employee_id);

    const workHistory = await WorkHistorySchema.find({
      employee_id: req.params.employee_id,
    })
      .populate("employee_id", "name email") // Fetch only necessary fields from User
      .populate("company_id", "_id name email"); // Fetch company details from User
    if (!workHistory) {
      return res.status(404).json({ message: "No work history found." });
    }
    res.json({ workHistory });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});


// Fetch Work History
router.post("/:employee_id", Authenticate, async (req, res) => {
  try {
    console.log("get emp history", req.params.employee_id);

    const workHistory = await WorkHistorySchema.find({
      employee_id: req.params.employee_id,
      company_id: req.userID,
    })
      .populate("employee_id", "name email") // Fetch only necessary fields from User
      .populate("company_id", "_id name email"); // Fetch company details from User
    if (!workHistory) {
      return res.status(404).json({ message: "No work history found." });
    }
    res.json({ workHistory });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Request Work History

router.post("/request/sent", Authenticate, async (req, res) => {
  try {
    const { employee_id, jobTitle, jobDescription, salary } = req.body;
    console.log("request work history", req.body);

    if (!jobTitle || !jobDescription || !salary) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequest = new WorkHistorySchema({
      employee_id,
      company_id: req.userID,
      jobTitle,
      jobDescription,
      salary,
      status: "Pending",
    });

    console.log(newRequest);

    await newRequest.save();
    res.json({ message: "Work history request sent successfully." });
  } catch (error) {
    console.error("Error requesting work history:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Upload File for Existing Work History
router.post(
  "/upload/:id",
  upload.single("profile"),
  Authenticate,
  async (req, res) => {
    try {
      const workHistory = await WorkHistorySchema.findById(req.params.id);
      if (!workHistory) {
        return res.status(404).json({ message: "Work history not found." });
      }
      workHistory.file = req.file.filename;
      workHistory.status = "Uploaded";

      await workHistory.save();
      res.json({
        message: "File uploaded successfully.",
        file: workHistory.file,
      });
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
