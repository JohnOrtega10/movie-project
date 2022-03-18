//Models
const { Movie } = require('../models/movie.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');

exports.getAllMovies = catchAsync(
  async (req, res, next) => {
    const movies = await Movie.findAll({
      where: { status: 'active' }
    });

    res.status(200).json({
      status: 'success',
      data: { movies }
    });
  }
);

exports.getMovieById = catchAsync(
  async (req, res, next) => {}
);

exports.createNewMovie = catchAsync(
  async (req, res, next) => {}
);

exports.updateMovie = catchAsync(
  async (req, res, next) => {}
);

exports.deleteMovie = catchAsync(
  async (req, res, next) => {}
);
