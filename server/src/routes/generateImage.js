const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const axios = require("axios");


const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
const API_KEY = process.env.HUGGINGFACE_API_KEY; // Replace with your actual key

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${API_KEY}` }, responseType: "arraybuffer" }
    );

    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});



module.exports = router;
