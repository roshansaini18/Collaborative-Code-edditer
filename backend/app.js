// backend/app.js
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const codeRoutes = require('./routes/codeRoutes');
const codeRunner = require('./routes/coderunRoutes');

const app = express();

console.log('Express application is being configured...');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', userRoutes);
app.use('/api', codeRoutes);
app.use('/api', codeRunner);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if (req.accepts('json')) {
    res.json({ message: err.message });
  } else {
    res.render('error');
  }
});

module.exports = app;