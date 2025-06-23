import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiUrl, huggingfaceapi } from "../data/api";
import Navbar from "../components/Navbar";

const EmailMarketing = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "https://api-inference.huggingface.co/models/gpt2";
  const HUGGING_FACE_API_KEY =huggingfaceapi; // Replace with your Hugging Face API key
  const BACKEND_URL = "http://localhost:5000/send-email"; // Your backend server

  const generateEmail = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedEmail("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate email");

      const data = await response.json();
      setGeneratedEmail(data[0]?.generated_text || "No content generated.");
    } catch (error) {
      console.error("Error generating email:", error);
      setGeneratedEmail("Error generating email. Please try again.");
    }

    setLoading(false);
  };

  const sendEmail = async () => {
    if (!recipientEmail || !generatedEmail) return;
    setSending(true);
    setMessage("");

    try {
      const response = await fetch(apiUrl + "/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail,
          subject: "Your AI-Generated Email",
          content: generatedEmail,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Email sent successfully!");
      } else {
        setMessage("❌ Error: " + result.error);
      }
    } catch (error) {
      setMessage("❌ Failed to send email. Try again.");
    }

    setSending(false);
  };

  return (
    <>
    <Navbar/>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 text-center w-50">
        <h2 className="mb-4 text-primary">AI Email Generator</h2>

        {/* Input for Email Topic */}
        <div className="mb-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter email topic (e.g., Black Friday Sale)"
            className="form-control"
            />
        </div>

        {/* Generate Email Button */}
        <button onClick={generateEmail} className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Generating..." : "Generate Email"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="mt-4">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2 text-secondary">Generating, please wait...</p>
          </div>
        )}

        {/* Display Generated Email */}
        {generatedEmail && !loading && (
          <div className="mt-4">
            <h5 className="text-success">Generated Email:</h5>
            <p className="border p-3 rounded text-start">{generatedEmail}</p>

            {/* Input for Recipient Email */}
            <div className="mt-3">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient email"
                className="form-control"
                />
            </div>

            {/* Send Email Button */}
            <button onClick={sendEmail} className="btn btn-warning mt-3" disabled={sending}>
              {sending ? "Sending..." : "Send Email"}
            </button>

            {/* Download Button */}
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(generatedEmail)}`}
              download="email_marketing_content.txt"
              className="btn btn-success mt-3"
              >
              Download as TXT
            </a>

            {/* Status Message */}
            {message && <p className="mt-3">{message}</p>}
          </div>
        )}
      </div>
    </div>
        </>
  );
};

export default EmailMarketing;
