const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Import the Item model
const userMiddleware = require('../middleware/userMiddleware');

router.get('/',userMiddleware, async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 }); // Fetch items from the database
        const lang = req.query.lang || 'en';
        res.render('index', { items, lang, userId: req.session.userId,  user: req.user}); // Pass items to the index page
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error fetching items' });
    }
});


module.exports = router;

