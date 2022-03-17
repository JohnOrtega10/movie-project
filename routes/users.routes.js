const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createNewUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);
module.exports = { usersRouter: router };
