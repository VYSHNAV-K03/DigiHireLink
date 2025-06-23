import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../data/api";

import Navbar from "../components/Navbar";

const AiImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await axios.post(apiUrl + "/generate-image", { prompt }, { responseType: "blob" });

      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectURL);
    } catch (error) {
      console.error("Error generating image:", error);
    }

    setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="container text-center mt-4">
      <h2 className="mb-3">AI Image Generator</h2>

      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          className="form-control w-50 me-2"
        />
        <button onClick={generateImage} className="btn btn-primary" disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {loading && (
        <div className="mt-3">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Generating, please wait...</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated AI" className="img-fluid rounded shadow-lg" />
          <div className="mt-3">
            <a href={imageUrl} download="generated_image.png" className="btn btn-success">
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default AiImage;
