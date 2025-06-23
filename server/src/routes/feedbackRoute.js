const express = require("express");
const Feedback = require("../modelschemas/FeedbackSchema");
const Authenticate = require("../middleware/authenticate");

const router = express.Router();


  
  router.post("/get_feedback",Authenticate, async (req, res) => {
    try {
      // const empid = req.params.empid;
      const feedbacks = await Feedback.find({ employee_id:req.userID }).populate("company_id")
      ;
      res.json({ feedbacks });
    } catch (error) {
      res.status(500).json({ error: "Error fetching feedback" });
    }
  });
  

  router.post("/get_feedback/company/comp",Authenticate, async (req, res) => {
    try {
      console.log("company id",req.userID);
      
      const { employee_id } = req.body;
      const feedbacks = await Feedback.find({ company_id:req.userID,employee_id });
      res.json({ feedbacks });
    } catch (error) {
      res.status(500).json({ error: "Error fetching feedback" });
    }
  });
  // Upload feedback
  router.post("/upload_feedback",Authenticate, async (req, res) => {
    try {
      const { employee_id, title, description, rating } = req.body;
      const newFeedback = new Feedback({company_id: req.userID, employee_id, title, description, rating });
      console.log("uploading new feedback",newFeedback);
      
      await newFeedback.save();
      res.json({ message: "Feedback uploaded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error uploading feedback" });
    }
  });
  

  module.exports = router;