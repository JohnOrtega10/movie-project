const { ref, uploadBytes } = require('firebase/storage');

//Models
const { Actor } = require('../models/actor.model');
// const {
//   ActorInMovie
// } = require('../models/actorInMovie.model');
// const { Movie } = require('../models/movie.model');
//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');
const { storage } = require('../utils/firebase');

exports.getAllActors = catchAsync(
  async (req, res, next) => {
    const actors = await Actor.findAll({
      where: { status: 'active' }
      //   include: [
      //     { model: ActorInMovie, include: [{ model: Movie }] }
      //   ]
    });

    res.status(200).json({
      status: 'success',
      data: { actors }
    });
  }
);

exports.getActorById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const actor = await Actor.findOne({
      where: { id, status: 'active' }
    });
    if (!actor) {
      return next(new AppError(404, 'Actor not found'));
    }

    res.status(200).json({
      status: 'success',
      data: { actor }
    });
  }
);

exports.createNewActor = catchAsync(
  async (req, res, next) => {
    const { name, country, raiting, age } = req.body;

    if (!name || !country || !raiting || !age) {
      return next(
        new AppError(
          400,
          'Must provide a valid name, country, raiting, age and profilePic'
        )
      );
    }

    //Upload img to Cloud Storage
    const imgRef = ref(
      storage,
      `images/actor/${Date.now()}-${req.file.originalname}`
    );

    const result = await uploadBytes(
      imgRef,
      req.file.buffer
    );



    const newActor = await Actor.create({
      name,
      country,
      raiting,
      age,
      profilePic: result.metadata.fullPath
    });

    res.status(201).json({
      status: 'success',
      data: { newActor }
    });
  }
);

exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(
    req.body,
    'name',
    'country',
    'age'
  );

  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });

  if (!actor) {
    return next(
      new AppError(404, 'Cant update actor, invalid ID')
    );
  }

  await actor.update({ ...data });
  res.status(204).json({ status: 'success' });
});

exports.deleteActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const actor = await Actor.findOne({
    where: { id, status: 'active' }
  });
  if (!actor) {
    return next(
      new AppError(404, 'Cant delete actor, invalid ID')
    );
  }

  await actor.update({ status: 'delected' });
  res.status(204).json({ status: 'success' });
});
