const express = require('express');
const { body } = require('express-validator');

//Controllers
const {
  getAllActors,
  getActorById,
  createNewActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

//Middlewares
const {
  validateSession,
  protectedAdmin
} = require('../middlewares/auth.middleware');

const { actorExists } = require('../middlewares/actors.middleware');

//Utils
const { upload } = require('../utils/multer');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .get(getAllActors)
  .post(
    protectedAdmin,
    upload.single('actorPic'),
    [
      body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Must provide a valid name'),
      body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Must provide a valid country'),
      body('raiting')
        .isNumeric()
        .withMessage('Raiting must be a number')
        .custom((value) => value > 0 && value <= 5)
        .withMessage('Must provide a value between 1 and 5'),
      body('age')
        .isNumeric()
        .withMessage('Age must be a number')
        .custom((value) => value > 0)
        .withMessage('Age must be greater than zero')
    ],
    createNewActor
  );

router
  .use('/:id', actorExists)
  .route('/:id')
  .get(getActorById)
  .patch(protectedAdmin, updateActor)
  .delete(protectedAdmin, deleteActor);

module.exports = { actorsRouter: router };
