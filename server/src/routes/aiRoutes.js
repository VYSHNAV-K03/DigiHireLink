const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load .env variables
const fs = require("fs");
const path = require("path");

const router = express.Router();

let textGenerator, sentimentAnalyzer;

// Load GPT-2 Model Asynchronously Using Dynamic Import
async function loadModel() {
  const { pipeline } = await import("@xenova/transformers");
  textGenerator = await pipeline("text-generation", "Xenova/gpt2");
  sentimentAnalyzer = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );
  console.log("GPT-2 Model Loaded Successfully!");
}
// loadModel();

// Generate AI-powered social media post
router.post("/generate-post", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required." });

    const response = await textGenerator(
      `Write a social media post about ${topic}:`,
      { max_new_tokens: 50 }
    );
    res.json({
      post: response[0].generated_text
        .replace(`Write a social media post about ${topic}:`, "")
        .trim(),
    });
  } catch (error) {
    console.error("Post generation error:", error);
    res.status(500).json({ error: "Failed to generate post." });
  }
});

// Sentiment Analysis for Social Media Post
router.post("/analyze-post", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required." });

    const result = await sentimentAnalyzer(text);
    res.json({ sentiment: result[0] });
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    res.status(500).json({ error: "Failed to analyze sentiment." });
  }
});

router.post("/generate-content", async (req, res) => {
  try {
    if (!textGenerator) {
      return res
        .status(500)
        .json({ error: "Model is still loading, please wait..." });
    }

    const { prompt } = req.body;
    const output = await textGenerator(prompt, {
      max_length: 200,
      num_return_sequences: 1,
    });

    res.json({ generated_text: output[0].generated_text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

router.post("/chatbot", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message is required." });

    const response = await textGenerator(`User: ${message}\nAI:`, {
      max_new_tokens: 50,
    });

    res.json({
      reply: response[0].generated_text
        .replace(`User: ${message}\nAI:`, "")
        .trim(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

router.post("/generate-seo-content", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await textGenerator(prompt, { max_length: 150 });
    res.json({ seoContent: result[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate SEO content" });
  }
});

router.post("/generate-email", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic)
      return res.status(400).json({ error: "Please provide a topic." });

    const output = await textGenerator(topic, { max_new_tokens: 100 });

    res.json({ emailContent: output[0].generated_text });
  } catch (error) {
    console.error("Error generating email:", error);
    res.status(500).json({ error: "Failed to generate email." });
  }
});

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
const HUGGINGFACE_API_KEY = `Bearer ${process.env.HUGGINGFACE_API_KEY}`;

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Ensure the 'public' folder exists
    const publicPath = path.join(__dirname, "../../public");
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: { Authorization: HUGGINGFACE_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const imagePath = path.join(publicPath, "generated_image.jpg");
    fs.writeFileSync(imagePath, response.data, "binary");

    res.json({ imageUrl: `http://localhost:5300/public/generated_image.jpg` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate image" });
  }
});

module.exports = router;
