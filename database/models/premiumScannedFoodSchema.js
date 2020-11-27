const mongoose = require("mongoose");

const PremiumScannedFoods = new mongoose.Schema({
  userId: String,
  isPremium: Boolean,
  consolidatedScannedFood: Object,
  createDate: String,
  updateDate: Date,
  s3URL: String,
});

module.exports = mongoose.model(
  "PremiumScannedFoods",
  PremiumScannedFoods,
  "scanned-foods-collection"
);
