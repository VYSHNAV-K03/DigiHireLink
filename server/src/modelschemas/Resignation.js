const mongoose = require("mongoose");

const ResignationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER", // Assuming a company model exists
    required: true,
  },
  resignReason: {
    type: String,
    required: true,
  },
  resignDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Resignation", ResignationSchema);
