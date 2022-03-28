const express = require('express');
const { body } = require('express-validator');

//Controllers
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/users.controller');

//Middlewares
const {
  validateSession,
  protectedAdmin
} = require('../middlewares/auth.middleware');

const {
  userExists,
  protectAccountOwner
} = require('../middlewares/users.middleware');

const router = express.Router();

router.post(
  '/',
  [
    body('username')
      .isString()
      .withMessage('Username must be a String')
      .notEmpty()
      .withMessage('Must provide a valid username'),
    body('email')
      .isString()
      .withMessage('Email must be a String')
      .notEmpty()
      .withMessage('Must provide a valid email'),
    body('password')
      .isString()
      .withMessage('Password must be a String')
      .notEmpty()
      .withMessage('Must provide a valid password')
  ],
  createNewUser
);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/', protectedAdmin, getAllUsers);

router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
