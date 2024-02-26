// models/UserAction.js
const mongoose = require('mongoose');

const userActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true }, // Пример: 'search'
  actionDetails: { type: String, required: true }, // Детали действия, например, имя персонажа
  createdAt: { type: Date, default: Date.now },
});

const UserAction = mongoose.model('UserAction', userActionSchema);

module.exports = UserAction;
