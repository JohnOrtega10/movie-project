//Models
const { Actor } = require('../models/actor.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');

exports.actorExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });

  if (!actor) {
    return next(new AppError(404, 'Actor not found with given id'));
  }

  req.actor = actor;

  next();
});
