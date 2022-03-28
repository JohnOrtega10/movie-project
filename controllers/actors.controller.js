const { validationResult } = require('express-validator');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//Models
const { Actor } = require('../models/actor.model');
const { Movie } = require('../models/movie.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsyn');
const { filterObj } = require('../utils/filterObj');
const { storage } = require('../utils/firebase');

exports.getAllActors = catchAsync(async (req, res, next) => {
  const actors = await Actor.findAll({
    where: { status: 'active' },
    include: [{ model: Movie }]
  });

  const actorsPromises = actors.map(
    async ({ id, name, country, raiting, age, profilePic, movies }) => {
      const imgRef = ref(storage, profilePic);
      const imgDownloadUrl = await getDownloadURL(imgRef);

      return {
        id,
        name,
        country,
        raiting,
        age,
        profilePic: imgDownloadUrl,
        movies
      };
    }
  );

  const resultActorsPromises = await Promise.all(actorsPromises);

  res.status(200).json({
    status: 'success',
    data: { actors: resultActorsPromises }
  });
});

exports.getActorById = catchAsync(async (req, res, next) => {
  const { actor } = req;

  const refImg = ref(storage, actor.profilePic);

  const imgDownloadUrl = await getDownloadURL(refImg);

  actor.profilePic = imgDownloadUrl;

  res.status(200).json({
    status: 'success',
    data: { actor }
  });
});

exports.createNewActor = catchAsync(async (req, res, next) => {
  const { name, country, raiting, age } = req.body;

  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    const errosMsg = erros
      .array()
      .map(({ msg }) => msg)
      .join('. ');
    return next(new AppError(400, errosMsg));
  }

  const fileExtension = req.file.originalname.split('.')[1];

  const imgRef = ref(
    storage,
    `imgs/actors/${name}-${Date.now()}.${fileExtension}`
  );

  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const newActor = await Actor.create({
    name,
    country,
    raiting,
    age,
    profilePic: imgUploaded.metadata.fullPath
  });

  res.status(201).json({
    status: 'success',
    data: { newActor }
  });
});

exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'name', 'country', 'age');
  const { actor } = req;

  await actor.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteActor = catchAsync(async (req, res, next) => {
  const { actor } = req;

  await actor.update({ status: 'delected' });

  res.status(204).json({ status: 'success' });
});
