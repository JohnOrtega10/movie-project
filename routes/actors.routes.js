const express = require('express');
const router = express.Router();

const {
  getAllActors,
  getActorById,
  createNewActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

//Utils
const { upload } = require('../utils/multer');

router.get('/', getAllActors);

router.get('/:id', getActorById);

router.post('/', upload.single('actorPic'), createNewActor);

router.patch('/:id', updateActor);

router.delete('/:id', deleteActor);

module.exports = { actorsRouter: router };
