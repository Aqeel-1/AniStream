/* app.js
 * this file contain all main routes in the api
 * also contain importent middleweres that used by the app itself
 * like central error handling middlewere, etc.
 */

const express = require('express');
const animeRouter = require('./routes/animeRoutes');

// create the main app
const app = express();

// middleweres
app.use(express.json());

// Routers
app.use('/api/v1/animes', animeRouter);
module.exports = app;
