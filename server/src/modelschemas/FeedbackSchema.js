const mongoose = require("mongoose");

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    company_id: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
    employee_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Feedback = mongoose.model("Feedback", FeedbackSchema);
  module.exports = Feedback;