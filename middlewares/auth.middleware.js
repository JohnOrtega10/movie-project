const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { catchAsync } = require('../utils/catchAsyn');
const { promisify } = require('util');
const { User } = require('../models/user.model');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

exports.validateSession = catchAsync(
  async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(401, 'Invalid session'));
    }

    const decodeToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      where: { id: decodeToken.id, status: 'active' }
    });

    if (!user) {
      return next(new AppError(401, 'Invalid session'));
    }

    req.currentUser = user;

    next();
  }
);
