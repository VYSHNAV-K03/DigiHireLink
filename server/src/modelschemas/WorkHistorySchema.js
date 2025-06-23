const mongoose = require("mongoose");

const WorkHistorySchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  status: { type: String, enum: ["Uploaded", "Pending"], default: "Pending" },
  file: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkHistory", WorkHistorySchema);
