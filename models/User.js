// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }, // Добавлено
  deletedAt: { type: Date }, // Добавлено
});

userSchema.methods.isDeleted = function () {
  return !!this.deletedAt;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
