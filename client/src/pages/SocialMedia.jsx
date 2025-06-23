import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { apiUrl } from "../data/api";
import Navbar from "../components/Navbar";

const SocialMedia = () => {
  const [topic, setTopic] = useState("");
  const [post, setPost] = useState("");
  const [analyzeText, setAnalyzeText] = useState("");
  const [sentiment, setSentiment] = useState(null);

  // Generate AI Social Media Post
  const generatePost = async () => {
    if (!topic.trim()) return;
    try {
      const response = await axios.post(apiUrl + "/ai/generate-post", { topic });
      setPost(response.data.post);
    } catch (error) {
      console.error("Error generating post:", error);
      setPost("Error generating post.");
    }
  };

  // Analyze Sentiment of a Post
  const analyzeSentiment = async () => {
    if (!analyzeText.trim()) return;
    try {
      const response = await axios.post(apiUrl + "/ai/analyze-post", { text: analyzeText });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setSentiment("Error analyzing sentiment.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h2 className="text-center">AI Social Media Assistant</h2>

      {/* Post Generator */}
      <div className="card p-3 mb-3">
        <h4>Generate AI Social Media Post</h4>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter topic (e.g., Fitness, Technology, etc.)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="btn btn-primary" onClick={generatePost}>
            Generate
          </button>
        </div>
        {post && <p className="mt-3 alert alert-success">{post}</p>}
      </div>

      {/* Sentiment Analysis */}
      <div className="card p-3">
        <h4>Analyze Post Sentiment</h4>
        <textarea
          className="form-control"
          placeholder="Paste a social media post to analyze"
          value={analyzeText}
          onChange={(e) => setAnalyzeText(e.target.value)}
        ></textarea>
        <button className="btn btn-warning mt-2" onClick={analyzeSentiment}>
          Analyze Sentiment
        </button>
        {sentiment && (
          <p className={`mt-3 alert ${sentiment.label === "POSITIVE" ? "alert-success" : "alert-danger"}`}>
            Sentiment: {sentiment.label} (Confidence: {Math.round(sentiment.score * 100)}%)
          </p>
        )}
      </div>
    </div>
    </>

  );
};

export default SocialMedia;
