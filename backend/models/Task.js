const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    requiredResource: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Unassigned", "In Transit", "Delivered"],
      default: "Unassigned",
    },
    urgency: {
      type: String,
      enum: ["Critical", "High", "Medium"],
      default: "Medium",
    },
    assignedVolunteer: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
