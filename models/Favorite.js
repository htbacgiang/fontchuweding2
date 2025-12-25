const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  deviceId: { 
    type: String, 
    required: true, 
    index: true, 
    unique: true 
  },
  fonts: [{ type: String }],
  brideGroomName: { 
    type: String, 
    default: '', 
    trim: true 
  }
}, { timestamps: true }); // <--- Thêm dòng này

module.exports = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
