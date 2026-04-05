const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    aqiScore: { type: Number, required: true },
    vulnerabilityIndex: { type: Number, default: 0 },
    urgencyScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", zoneSchema);
