import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Navbar from "../components/Navbar";
import { huggingfaceapi } from "../data/api";

const AiContent = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api-inference.huggingface.co/models/gpt2";
  const API_KEY = huggingfaceapi; // Replace with your actual Hugging Face API key

  const generateContent = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedText(""); // Clear previous content before generating a new one

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const data = await response.json();
      setGeneratedText(data[0]?.generated_text || "No content generated.");
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedText("Error generating content. Please try again.");
    }

    setLoading(false);
  };

  // Function to download the generated content as a .txt file
  const downloadContent = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_content.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <Navbar  />
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 text-center w-50">
        <h2 className="mb-4 text-primary">AI Content Generator</h2>

        {/* Input Box */}
        <div className="mb-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="form-control"
          />
        </div>

        {/* Generate Button */}
        <button 
          onClick={generateContent}
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-secondary">Generating, please wait...</p>
          </div>
        )}

        {/* Display Generated Content */}
        {generatedText && !loading && (
          <div className="mt-4">
            <h5 className="text-success">Generated Content:</h5>
            <p className="border p-3 rounded text-start">{generatedText}</p>

            {/* Download Button */}
            <button 
              onClick={downloadContent}
              className="btn btn-success mt-3"
            >
              Download as TXT
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AiContent;
