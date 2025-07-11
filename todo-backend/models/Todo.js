const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  tags: [String],
  completed: { type: Boolean, default: false },
  filePath: String,
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);
