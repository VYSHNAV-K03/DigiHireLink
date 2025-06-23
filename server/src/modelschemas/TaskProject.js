const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true },
  task_name: { type: String, required: true },
  task_description: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  completion_file: { type: String }, // New field for storing file path
  created_at: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
