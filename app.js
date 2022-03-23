const express = require('express');
const { usersRouter } = require('./routes/users.routes');
const { actorsRouter } = require('./routes/actors.routes');
const { moviesRouter } = require('./routes/movies.routes');

const {
  globalErrorHandler
} = require('./controllers/error.controler');
const app = express();

// Enable JSON incoming data
app.use(express.json());

// Enable multipart/form-data incoming data (to receive files)
app.use(express.urlencoded({ extended: true }));

//Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/actors', actorsRouter);
app.use('/api/v1/movies', moviesRouter);

app.use(globalErrorHandler);

module.exports = { app };
