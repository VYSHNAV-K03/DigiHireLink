import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { api, apiUrl } from "../data/api";
import Navbar from "../components/Navbar";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setChat([...chat, { sender: "User", text: message }]);

    try {
      const response = await axios.post(apiUrl + "/ai/chatbot", { message });
      setChat([...chat, { sender: "User", text: message }, { sender: "AI", text: response.data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setChat([...chat, { sender: "AI", text: "Error generating response." }]);
    }
    setMessage("");
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h2 className="text-center">AI Chatbot</h2>
      <div className="border p-3 mb-3" style={{ height: "400px", overflowY: "auto", background: "#f8f9fa" }}>
        {chat.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === "User" ? "text-end" : "text-start"}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
    </>

  );
};

export default Chatbot;
