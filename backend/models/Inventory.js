const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    totalStock: { type: Number, required: true, default: 0 },
    deployed: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    category: { type: String, enum: ["masks", "purifiers", "oxygen", "medical", "other"], default: "other" },
  },
  { timestamps: true }
);

// Auto-calculate available before save
inventorySchema.pre("save", function (next) {
  this.available = this.totalStock - this.deployed;
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);
