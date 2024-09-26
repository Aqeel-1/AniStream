/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const catchAsync = require('../utils/catchAsync');
const Episode = require('../models/episodeModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllEpisodes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Episode.find({ animeId: req.params.animeId }),
    req.query,
  )
    .limitFields()
    .paginate();

  const episodes = await features.query;

  res.status(200).json({
    status: 'success',
    results: episodes.length,
    data: {
      episodes,
    },
  });
});

exports.createEpisode = catchAsync(async (req, res, next) => {
  const episodeInfo = req.body;
  episodeInfo.animeId = req.params.animeId;
  const newEpisode = await Episode.create(episodeInfo);

  res.status(201).json({
    status: 'success',
    data: {
      newEpisode,
    },
  });
});

exports.getEpisode = catchAsync(async (req, res, next) => {
  const epsiode = await Episode.find({
    animeId: req.params.animeId,
    _id: req.params.episodeId,
  });
  res.status(200).json({
    status: 'success',
    data: epsiode,
  });
});

exports.updateEpisode = catchAsync(async (req, res, next) => {
  const episode = await Episode.findOne({
    animeId: req.params.animeId,
    _id: req.params.episodeId,
  });

  if (!episode) {
    return next(new AppError('this episode for this anime not found!', 404));
  }

  const updatedEpisode = await Episode.findByIdAndUpdate(
    req.params.episodeId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: 'success',
    data: updatedEpisode,
  });
});

exports.deleteEpisode = catchAsync(async (req, res, next) => {
  const episode = await Episode.findOne({
    animeId: req.params.animeId,
    _id: req.params.episodeId,
  });

  if (!episode) {
    return next(new AppError('this episode for this anime not found!', 404));
  }

  await Episode.findByIdAndDelete(req.params.episodeId);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
