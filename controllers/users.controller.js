const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Models
const { User } = require('../models/user.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');

dotenv.config({ path: './config.env' });
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    exclude: ['password']
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id, status: 'active' },
    exclude: ['password']
  });
  if (!user) {
    return next(new AppError(404, 'User not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.createNewUser = catchAsync(
  async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        new AppError(
          400,
          'Must provide a valid username, email and password'
        )
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: { newUser }
    });
  }
);

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(req.body, 'username', 'email');

  const user = await User.findOne({
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(
      new AppError(404, 'Cant update user, invalid ID')
    );
  }

  await user.update({ ...data });
  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id, status: 'active' }
  });
  if (!user) {
    return next(
      new AppError(404, 'Cant delete user, invalid ID')
    );
  }

  await user.update({ status: 'delected' });
  res.status(204).json({ status: 'success' });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return next(
      new AppError(400, 'Credencials are invalid')
    );
  }

  const token = await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});
