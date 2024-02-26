// routes/mainRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const StarWarsCharacter = require('../models/starWarsCharacter'); // Путь к вашей модели
const RickAndMortyCharacter = require('../models/rickAndMortyCharacter'); // Path to your model
const UserAction = require('../models/UserAction');
const userMiddleware = require('../middleware/userMiddleware');



// Rick and Morty API
router.get('/rickandmorty',userMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const response = await axios.get('https://rickandmortyapi.com/api/character', {
      params: {
        lang: lang,
      },
    });

    // Передаем данные в шаблон, включая characters
    res.render('rickandmorty', { lang: lang, characters: response.data.results,  userId: req.session.userId, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Rick and Morty API');
  }
});

router.get('/rickandmorty/search',userMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const searchQuery = req.query.query;

    // Проверяем, установлен ли сеанс пользователя
    const userId = req.session.userId || null;

    // Execute a search query based on user input
    const response = await axios.get('https://rickandmortyapi.com/api/character', {
      params: {
        lang: lang,
        name: searchQuery, // Assuming the API supports searching by name
      },
    });

    // Получаем массив персонажей из ответа API
    const characters = response.data.results;

    // Сохраняем каждого персонажа в базе данных
    for (const character of characters) {
      await RickAndMortyCharacter.create({
        name: character.name,
        status: character.status,
        gender: character.gender,
        species: character.species,
        image_url: character.image,
        // Добавьте любые другие поля, которые вы хотите сохранить
      });

      // Создаем запись UserAction только если userId существует
      if (userId) {
        await UserAction.create({
          userId: userId,
          actionType: 'search',
          actionDetails: `Поиск персонажа Рика и Морти: ${character.name}`,
        });
      }
    }

    // Передаем результаты поиска и параметр языка в шаблон
    res.render('rickandmorty', { lang: lang, characters: characters });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Rick and Morty API');
  }
});

// Star Wars API
router.get('/starwars',userMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const response = await axios.get('https://swapi.dev/api/people/', {
      params: {
        lang: lang,
      },
    });

    // Передаем данные в шаблон, включая charactersSW
    res.render('starwars', { lang: lang, characters: response.data.results,  userId: req.session.userId, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Star Wars API');
  }
});

router.get('/starwars/search',userMiddleware, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const searchQuery = req.query.query;

    // Проверяем, установлен ли сеанс пользователя
    const userId = req.session.userId || null;

    // Выполняем поисковый запрос на основе введенного пользователем значения
    const response = await axios.get('https://swapi.dev/api/people/', {
      params: {
        lang: lang,
        search: searchQuery,
      },
    });

    // Получаем массив персонажей из ответа API
    const characters = response.data.results;

    // Сохраняем каждого персонажа в базе данных
    for (const character of characters) {
      await StarWarsCharacter.create({
        name: character.name,
        height: character.height,
        mass: character.mass,
        gender: character.gender,
        birth_year: character.birth_year,
        eye_color: character.eye_color,
      });

      // Создаем запись в UserAction только если userId существует
      if (userId) {
        await UserAction.create({
          userId: userId,
          actionType: 'search',
          actionDetails: `Поиск персонажа Звездных войн: ${character.name}`,
        });
      }
    }

    // Передаем результаты поиска и параметр языка в шаблон
    res.render('starwars', { lang: lang, characters: characters });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from Star Wars API');
  }
});

module.exports = router;

// // Marvel Comics API
// router.get('/marvel', async (req, res) => {
//   try {
//     const publicKey = 'your_public_key';
//     const privateKey = 'your_private_key';
//     const ts = new Date().getTime();
//     const hash = crypto.createHash('md5').update(ts + privateKey + publicKey).digest('hex');

//     const response = await axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`);

//     // Передаем данные в шаблон, включая characters
//     res.render('marvel', { characters: response.data.data.results });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching data from Marvel Comics API');
//   }
// });
