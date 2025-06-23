const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const { recipientEmail, subject, content } = req.body;

  if (!recipientEmail || !subject || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const msg = {
    to: recipientEmail,
    from: "amarnathappu891@gmail.com", // Replace with a verified sender email
    subject: subject,
    text: content,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});


module.exports = router;
