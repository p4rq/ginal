// routes/adminRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const User = require('../models/User');
const Item = require('../models/Item');

const router = express.Router();

// Middleware for admin authorization
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    

    if (user && user.role === 'admin') {
      return next();
    } else {
      res.status(403).send('Forbidden - Admin access required');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Admin page route
router.get('/', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const items = await Item.find();
    const lang = req.query.lang || 'en';

    res.render('admin', { items, lang: lang });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new item
router.post('/items', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const { pictures, names, descriptions } = req.body;
    const item = new Item({ pictures, names, descriptions });
    await item.save();
    res.redirect('/admin'); // Redirect to the admin page after adding an item
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific item by ID
router.get('/items/:id', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const itemId = req.params.id;

    // Check if the provided ID is for adding a new item
    if (itemId === 'add') {
      // Handle the case for adding a new item (redirect to the add item page or any other appropriate action)
      return res.redirect('/admin/items/add');
    }

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).send('Invalid item ID');
    }

    const item = await Item.findById(itemId);

    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete a specific item by ID
router.delete('/items/:id/delete', authenticationMiddleware, isAdmin, async (req, res) => {
    try {
      const itemId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).send('Invalid item ID');
      }
  
      const deletedItem = await Item.findByIdAndDelete(itemId);
  
      if (deletedItem) {
        // Redirect back to the admin page after successful deletion
        res.redirect('/admin');
      } else {
        res.status(404).send('Item not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
router.put('/items/:id/edit', authenticationMiddleware, isAdmin, async (req, res) => {
    try {
      const itemId = req.params.id;
      const { pictures, names, descriptions } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).send('Invalid item ID');
      }
  
      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        { pictures, names, descriptions },
        { new: true }
      );
  
      if (updatedItem) {
        res.redirect('/admin');
      } else {
        res.status(404).send('Item not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


  // Admin page route for users
router.get('/users', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const lang = req.query.lang || 'en';

    res.render('adminUsers', { users, lang: lang });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new user
router.post('/users', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.redirect('/admin/users'); // Redirect to the admin users page after adding a user
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific user by ID
router.get('/users/:id', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }

    const user = await User.findById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a specific user by ID
router.post('/users/:id/delete', async (req, res) => {
  try {
    const userId = req.params.id;

    // Устанавливаем deletedAt на текущую дату
    await User.findByIdAndUpdate(userId, { deletedAt: new Date() });

    // Разлогиниваем пользователя, если он удаляет свой собственный аккаунт
    if (req.session.userId === userId) {
      req.session.destroy(() => {
        res.redirect('/');
      });
    } else {
      res.redirect('/admin/users');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a specific user by ID
router.post('/users/:id/edit', authenticationMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password, role },
      { new: true }
    );

    if (updatedUser) {
      res.redirect('/admin/users'); // Redirect back to the admin users page after successful update
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
