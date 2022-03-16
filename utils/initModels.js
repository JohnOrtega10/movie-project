const { User } = require('../models/user.model');
const { Actor } = require('../models/actor.model');
const { Movie } = require('../models/movie.model');
const { Review } = require('../models/review.model');
// const {
//   ActorInMovie
// } = require('../models/actorInMovie.model');

const initModels = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  Movie.hasMany(Review);
  Review.belongsTo(Movie);

  Movie.hasMany(Actor);
  Actor.belongsToMany(Movie);
};

module.exports = { initModels };
