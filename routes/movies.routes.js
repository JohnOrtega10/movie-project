const express = require('express');
const { body } = require('express-validator');

//Controllers
const {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller');

const {
  getAllReviews,
  getReviewById,
  createNewReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews.controller');

//Middlewares
const {
  validateSession,
  protectedAdmin
} = require('../middlewares/auth.middleware');

const { movieExists } = require('../middlewares/movies.middleware');

const {
  reviewExists,
  protectReviewOwner
} = require('../middlewares/reviews.middleware');

//Utils
const { upload } = require('../utils/multer');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .get(getAllMovies)
  .post(
    protectedAdmin,
    upload.single('imgMovie'),
    [
      body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Must provide a valid title'),
      body('description')
        .isString()
        .withMessage('Description must be a string')
        .notEmpty()
        .withMessage('Must provide a valid description'),
      body('duration')
        .isNumeric()
        .withMessage('Duration must be a number')
        .custom((value) => value > 0)
        .withMessage('Duration must be greater than 0'),
      body('raiting')
        .isNumeric()
        .withMessage('Rating must be a number')
        .custom((value) => value > 0 && value <= 5)
        .withMessage('Rating must be between 1 and 5'),
      body('genre')
        .isString()
        .withMessage('Genre must be a string')
        .notEmpty()
        .withMessage('Must provide a valid genre'),
      body('actors')
        .isArray({ min: 1 })
        .withMessage('Must provide at least one actor id')
    ],
    createNewMovie
  );

router
  .route('/reviews')
  .get(getAllReviews)
  .post(
    [
      body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Must provide a valid title'),
      body('comment')
        .isString()
        .withMessage('Comment must be a string')
        .notEmpty()
        .withMessage('Must provide a valid comment'),
      body('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .custom((value) => value > 0 && value <= 5)
        .withMessage('Must provide a value between 1 and 5'),
      body('movieId')
        .isNumeric()
        .withMessage('Age must be a number')
        .notEmpty()
        .withMessage('Must provide a valid comment')
    ],
    createNewReview
  );

router.route('/reviews/:movieId').get(getReviewById);

router
  .use('/reviews/id', reviewExists)
  .route('/reviews/id')
  .patch(protectReviewOwner, updateReview)
  .delete(protectReviewOwner, deleteReview);

router
  .use('/:id', movieExists)
  .route('/:id')
  .get(getMovieById)
  .patch(protectedAdmin, updateMovie)
  .delete(protectedAdmin, deleteMovie);

module.exports = { moviesRouter: router };
