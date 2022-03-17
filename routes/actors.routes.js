const express = require('express');
const router = express.Router();

const {
  getAllActors,
  getActorById,
  createNewActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

router.get('/', getAllActors);

router.get('/:id', getActorById);

router.post('/', createNewActor);

router.patch('/:id', updateActor);

router.delete('/:id', deleteActor);

module.exports = { actorsRouter: router };
