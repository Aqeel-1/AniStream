/* animeRoutes.js
 * this file contain all anime routes; get, post, patch, delete;
 */

const express = require('express');

const animeControllers = require('../controllers/animeControllers');
const episodeControllers = require('../controllers/episodeControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// routes
router
  .route('/')
  .get(animeControllers.getAllAnimes)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    animeControllers.createAnime,
  );

router
  .route('/:id')
  .get(animeControllers.getAnime)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    animeControllers.updateAnime,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    animeControllers.deleteAnime,
  );

// Route for managing episodes under an anime
router
  .route('/:animeId/episodes')
  .get(episodeControllers.getAllEpisodes) // Get all episodes for a specific anime
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    episodeControllers.createEpisode,
  ); // Create a new episode for a specific anime

router
  .route('/:animeId/episodes/:episodeId')
  .get(episodeControllers.getEpisode) // Get a specific episode
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    episodeControllers.updateEpisode,
  ) // Update an episode
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    episodeControllers.deleteEpisode,
  ); // Delete an episode

module.exports = router;
