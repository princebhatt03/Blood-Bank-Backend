require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const connectToDb = require('./db/db');
const Routes = require('./routes/index');

connectToDb();

const app = express();

// CORS with credentials
app.use(
  cors({
    origin: 'https://blood-bank-frontend-oafj.onrender.com',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Flash Messages
app.use(flash());

// Redirect root to frontend
app.get('/', (req, res) => {
  res.redirect('https://blood-bank-frontend-oafj.onrender.com');
});

// All other routes
app.use('/', Routes);

module.exports = app;
