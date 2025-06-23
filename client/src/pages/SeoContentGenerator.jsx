import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiUrl } from "../data/api";
import Navbar from "../components/Navbar";

const SeoContentGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSeoContent = async () => {
    setLoading(true);
    setError("");
    setSeoContent("");

    try {
      const res = await axios.post(apiUrl + "/ai/generate-seo-content", { prompt });
      setSeoContent(res.data.seoContent);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h2 className="text-primary">AI-Powered SEO Content Generator</h2>
      
      <div className="card p-3 mt-3">
        <h4>Enter Your Topic</h4>
        <input
          className="form-control"
          type="text"
          placeholder="Enter a topic (e.g., 'Best SEO Strategies in 2025')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={generateSeoContent} disabled={loading}>
          {loading ? "Generating..." : "Generate SEO Content"}
        </button>

        {error && <p className="text-danger mt-2">{error}</p>}
        {seoContent && (
          <div className="mt-3">
            <h5>Generated Content:</h5>
            <p className="p-2 bg-light border rounded">{seoContent}</p>
          </div>
        )}
      </div>
    </div>
    </>

  );
};

export default SeoContentGenerator;
