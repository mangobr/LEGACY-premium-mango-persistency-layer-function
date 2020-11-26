const mongoose = require('mongoose')

const PremiumScannedFoods = new mongoose.Schema({
    userId: String,
    consolidatedScannedFood: [Object],
    isPremium: true,
    createDate: String,
    updateDate: Date,
    s3URL: String
})

module.exports = mongoose.model('PremiumScannedFoods', PremiumScannedFoods, 'premium-scanned-foods-collection')