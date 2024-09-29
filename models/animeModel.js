/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const Episode = require('./episodeModel');
const AppError = require('../utils/AppError');

// Define a list of allowed anime genres (tags)
const allowedAnimeTags = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Supernatural',
  'Thriller',
];

// Define Anime Schema
const animeSchema = new mongoose.Schema({
  animeName: {
    type: String,
    required: [true, 'Anime name is required'],
    trim: true,
    minlength: [3, 'Anime name must be at least 3 characters long'],
    maxlength: [100, 'Anime name cannot exceed 100 characters'],
  },
  animeTags: {
    type: [String],
    required: [true, 'Anime tags are required'],
    validate: {
      validator: function (v) {
        return v.every((tag) => allowedAnimeTags.includes(tag));
      },
      message: `One or more tags are invalid. Allowed tags: ${allowedAnimeTags.join(', ')}.`,
    },
  },
  animeStory: {
    type: String,
    required: [true, 'Anime story is required'],
    trim: true,
    minlength: [10, 'Anime story must be at least 10 characters long'],
    maxlength: [1500, 'Anime story cannot exceed 1000 characters'],
  },
  animeRate: {
    type: Number,
    required: [true, 'Anime rating is required'],
    min: [0, 'Anime rating must be at least 0'],
    max: [10, 'Anime rating must be at most 10'],
  },
  animeReleaseDate: {
    type: Number, // Or Date if you want full date details
    required: [true, 'Release date is required'],
    min: [1900, 'Release year must be after 1900'],
    max: [new Date().getFullYear(), 'Release year cannot be in the future'],
  },
  animePosterUrl: {
    type: String,
    required: [true, 'Poster URL is required'],
    trim: true,
    validate: {
      validator: function (v) {
        return (
          validator.isURL(v, {
            protocols: ['http', 'https'],
            require_protocol: true,
          }) && /\.(jpeg|jpg|gif|png)$/.test(v)
        ); // Ensure it's a valid image URL
      },
      message:
        'Poster URL must be a valid image format (jpeg, jpg, gif, png) and a valid URL',
    },
  },
});

animeSchema.pre('findOneAndDelete', async function (next) {
  const animeId = this.getQuery()._id;

  try {
    // Delete all episodes associated with the anime
    await Episode.deleteMany({ animeId });
  } catch (err) {
    return next(
      new AppError('Cannot delete this anime, something went wrong!', 500),
    );
  }

  next();
});

// Create the Anime model from schema
const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
