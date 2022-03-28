//Models
const { Movie } = require('../models/movie.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');

exports.movieExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findOne({
    where: { id, status: 'active' }
  });
  if (!movie) {
    return next(new AppError(404, 'Movie not found with given id'));
  }

  req.movie = movie;
  next();
});
