//Models
const { Movie } = require('../models/movie.model');
const { Review } = require('../models/review.model');
const { User } = require('../models/user.model');

//Utils
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');
const { AppError } = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.findAll({
    where: { status: 'active' },
    include: [{ model: Movie }, { model: User }]
  });

  res.status(200).json({
    status: 'success',
    data: { reviews }
  });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const { title, comment, rating, movieId } = req.body;
  const { currentUser } = req;
  const newReview = await Review.create({
    title,
    comment,
    rating,
    userId: currentUser.id,
    movieId
  });

  res.status(201).json({
    status: 'success',
    data: { newReview }
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findOne({
    where: { id: movieId },
    include: [
      {
        model: Review,
        include: [{ model: User, attributes: { exclude: ['password'] } }]
      }
    ]
  });

  if (!movie) {
    return next(new AppError(404, 'Movie not found with given id'));
  }

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const data = filterObj(req.boy, 'title', 'comment', 'rating');
  const { review } = req;

  await review.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'delected' });

  res.status(204).json({ status: 'success' });
});
