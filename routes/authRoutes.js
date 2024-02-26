// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { pageTitle: 'Register', lang: req.session.lang }); // Assuming lang is stored in the session
});
  
  // Registration logic
  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({
        username,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await user.save();
  
      // Redirect to the login page after successful registration
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.route('/login')
  .get((req, res) => {
    res.render('login', { pageTitle: 'Login', lang: req.session.lang || 'en' }); // Assuming lang is stored in the session
  })
  .post(async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });

      // Check if user exists and compare passwords
      if (user && await bcrypt.compare(password, user.password)) {
        // Check if the account is deleted
        if (user.isDeleted()) {
          return res.status(403).send('This account has been deleted.');
        }

        // Set userId and lang in session for authentication and language selection
        req.session.userId = user._id;
        req.session.isAuthenticated = true;
        req.session.lang = req.body.lang || 'en'; // Save the selected language in session
        res.redirect('/'); // Redirect to the main page
      } else {
        console.log('Invalid username or password:', username, password);
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  
// Logout
router.get('/logout', (req, res) => {
  // Очищаем userId из объекта сессии
  req.session.userId = undefined; // или delete req.session.userId;

  // Уничтожаем сессию
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
