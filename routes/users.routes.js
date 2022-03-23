const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/users.controller');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createNewUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/login', loginUser);

module.exports = { usersRouter: router };
