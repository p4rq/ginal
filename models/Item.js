// models/Item.js
const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  lang: {
    type: String,
    enum: ['ru', 'en'], // Допустимые значения: 'ru' (русский) и 'en' (английский)
    required: true,
  },
  value: String,
});

const itemSchema = new mongoose.Schema({
  pictures: [String],
  names: [translationSchema],
  descriptions: [translationSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
