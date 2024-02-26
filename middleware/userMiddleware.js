// middleware/authenticationMiddleware.js
const User = require('../models/User');

const authenticationMiddleware = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      console.log('User:', user); // Log the user object for debugging

      if (user) {
        req.user = user; // Добавляем объект пользователя к объекту запроса для дальнейшего использования в маршрутах
        return next();
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  res.redirect('/auth/login');
};

module.exports = authenticationMiddleware;
