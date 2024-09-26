/* animeRoutes.js
 * this file contain all anime routes; get, post, patch, delete;
 */

const express = require('express');

const animeControllers = require('../controllers/animeControllers');
const episodeControllers = require('../controllers/episodeControllers');

const router = express.Router();

// routes
router
  .route('/')
  .get(animeControllers.getAllAnimes)
  .post(animeControllers.createAnime);

router
  .route('/:id')
  .get(animeControllers.getAnime)
  .patch(animeControllers.updateAnime)
  .delete(animeControllers.deleteAnime);

// Route for managing episodes under an anime
router
  .route('/:animeId/episodes')
  .get(episodeControllers.getAllEpisodes) // Get all episodes for a specific anime
  .post(episodeControllers.createEpisode); // Create a new episode for a specific anime

router
  .route('/:animeId/episodes/:episodeId')
  .get(episodeControllers.getEpisode) // Get a specific episode
  .patch(episodeControllers.updateEpisode) // Update an episode
  .delete(episodeControllers.deleteEpisode); // Delete an episode

module.exports = router;
