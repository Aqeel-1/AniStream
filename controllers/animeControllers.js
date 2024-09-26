/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
/* animeControllers.js
 * this file contain all controllers for handling anime requests
 */

const Anime = require('../models/animeModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllAnimes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Anime.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .sort('animeReleaseDate')
    .paginate();

  const animes = await features.query;
  res.status(200).json({
    status: 'success',
    results: animes.length,
    data: animes,
  });
});

exports.createAnime = catchAsync(async (req, res, next) => {
  const newAnime = await Anime.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newAnime,
    },
  });
});

exports.getAnime = catchAsync(async (req, res, next) => {
  const anime = await Anime.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: anime,
  });
});

exports.updateAnime = catchAsync(async (req, res, next) => {
  const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedAnime) {
    return next(new AppError('Anime not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedAnime,
  });
});

exports.deleteAnime = catchAsync(async (req, res, next) => {
  const deletedAnime = await Anime.findByIdAndDelete(req.params.id);

  if (!deletedAnime) {
    return next(new AppError('Anime not found!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: deletedAnime,
  });
});
