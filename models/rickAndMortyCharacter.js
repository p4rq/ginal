const mongoose = require('mongoose');

const rickAndMortyCharacterSchema = new mongoose.Schema({
  name: String,
  status: String,
  gender: String,
  species: String,
  image_url: String,
  // Add any other fields you want to save
});

const RickAndMortyCharacter = mongoose.model('RickAndMortyCharacter', rickAndMortyCharacterSchema);

module.exports = RickAndMortyCharacter;
