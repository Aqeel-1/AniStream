/* animeRoutes.js
 * this file contain all anime routes; get, post, patch, delete;
 */

const express = require('express');

const animeControllers = require('../controllers/animeControllers');

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
module.exports = router;
