//Models
const { Review } = require('../models/review.model');

//Utils
const { catchAsync } = require('../utils/catchAsyn');
const { AppError } = require('../utils/appError');

exports.reviewExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOne({ where: { id, status: 'active' } });

  if (!review) {
    return next(new AppError(404, 'Review not found with given id'));
  }

  req.review = review;

  next();
});

exports.protectReviewOwner = catchAsync((req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;

  if (currentUser.id !== +id) {
    return next(new AppError(400, 'You cant update other users review'));
  }

  next();
});
