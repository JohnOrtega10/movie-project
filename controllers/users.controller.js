const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');
dotenv.config({ path: './config.env' });

//Models
const { User } = require('../models/user.model');
const { Review } = require('../models/review.model');
const { Movie } = require('../models/movie.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    include: [{ model: Review, include: [{ model: Movie }] }]
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, errorMsg));
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const data = filterObj(req.body, 'username', 'email');
  const { user } = req;

  await user.update({ ...data });
  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'delected' });

  res.status(204).json({ status: 'success' });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credencials are invalid'));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});
