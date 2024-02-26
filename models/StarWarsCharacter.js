const mongoose = require('mongoose');

const starWarsCharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  height: String,
  mass: String,
  gender: String,
  birth_year: String, // Изменил "Birthday" на "birth_year"
  eye_color: String,
});

const StarWarsCharacter = mongoose.model('StarWarsCharacter', starWarsCharacterSchema);

module.exports = StarWarsCharacter;
