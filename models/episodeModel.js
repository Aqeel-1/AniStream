/* episodeModel.js
 * this file contain episodeModel and its logic
 */
const mongoose = require('mongoose');

const megaEmbedUrlRegex =
  /^https:\/\/mega\.nz\/embed\/[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+$/;

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: [true, 'Episode number is required'],
    min: [1, 'Episode number must be at least 1'],
  },
  animeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: [true, 'Anime ID is required'],
  },
  episodeUrl: {
    type: String,
    required: [true, 'Episode URL is required'],
    validate: {
      validator: function (v) {
        return megaEmbedUrlRegex.test(v); // Check if URL matches Mega embed format
      },
      message: 'Episode URL must be a valid Mega embed URL',
    },
  },
});

episodeSchema.index({ animeId: 1, episodeNumber: 1 }, { unique: true });
// Create Episode model
const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
