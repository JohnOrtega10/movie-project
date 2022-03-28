const { validationResult } = require('express-validator');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//Models
const { Actor } = require('../models/actor.model');
const { Movie } = require('../models/movie.model');
const { ActorInMovie } = require('../models/actorInMovie.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');
const { storage } = require('../utils/firebase');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    where: { status: 'active' },
    include: [{ model: Actor }]
  });

  const moviePromises = movies.map(
    async ({
      id,
      title,
      description,
      duration,
      raiting,
      img,
      genre,
      actors
    }) => {
      const refImg = ref(storage, img);
      const imgDownloadUrl = await getDownloadURL(refImg);

      return {
        id,
        title,
        description,
        duration,
        raiting,
        img: imgDownloadUrl,
        genre,
        actors
      };
    }
  );

  const resultMoviesPromises = await Promise.all(moviePromises);

  res.status(200).json({
    status: 'success',
    data: { movies: resultMoviesPromises }
  });
});

exports.getMovieById = catchAsync(async (req, res, next) => {
  const { movie } = req;

  const refImg = ref(storage, movie.img);
  const imgDownloadUrl = await getDownloadURL(refImg);

  movie.img = imgDownloadUrl;

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});

exports.createNewMovie = catchAsync(async (req, res, next) => {
  const { title, description, duration, raiting, genre, actors } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, errorsMsg));
  }

  const filextension = req.file.originalname.split('.')[1];

  const imgRef = ref(
    storage,
    `/imgs/movies/${title}-${Date.now()}.${filextension}`
  );

  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newMovie = await Movie.create({
    title,
    description,
    duration,
    raiting,
    img: imgUploaded.metadata.fullPath,
    genre
  });

  const actorsInMoviePromises = actors.map(async (actorId) => {
    return await ActorInMovie.create({
      actorId,
      movieId: newMovie.id
    });
  });

  await Promise.all(actorsInMoviePromises);

  res.status(201).json({
    status: 'success',
    data: { newMovie }
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const data = filterObj(
    req.body,
    'title',
    'description',
    'duration',
    'raiting'
  );

  const { movie } = req;

  await movie.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { movie } = req;

  await movie.update({ status: 'delected' });

  res.status(204).json({ status: 'success' });
});
