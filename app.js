require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const connectToDb = require('./db/db');
const Routes = require('./routes/index');

connectToDb();

const app = express();

// CORS Configuration - Allows frontend to send credentials (cookies)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'], // Ensure this matches your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration - Stores sessions in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Ensure it's correctly set in .env
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // True only in production
      httpOnly: false, // Set to true for security in production
      sameSite: 'lax',
    },
  })
);

// Flash Messages
app.use(flash());

// Ensure session exists before handling requests
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Session is not initialized properly'));
  }
  next();
});

// Redirect root to frontend
app.get('/', (req, res) => {
  const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(redirectUrl);
});

// All other routes
app.use('/', Routes);

module.exports = app;
