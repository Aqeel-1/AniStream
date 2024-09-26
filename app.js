/* eslint-disable import/no-extraneous-dependencies */
/* app.js
 * this file contain all main routes in the api
 * also contain importent middleweres that used by the app itself
 * like central error handling middlewere, etc.
 */

const express = require('express');
const cors = require('cors');
const animeRouter = require('./routes/animeRoutes');
const globalErrorHandler = require('./controllers/errorControllers');

// create the main app
const app = express();

// middleweres
app.use(cors());
app.use(express.json());

// Routers
app.use('/api/v1/animes', animeRouter);

// Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
