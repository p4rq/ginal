const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/apiRoutes');
const quizRoutes = require('./routes/quizRoutes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://anuarbek0471:1105@cluster0.gqviue2.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }, // Важно: установите secure в true для HTTPS
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/', mainRoutes);
app.use('/quiz', quizRoutes);
app.use(authenticationMiddleware);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
