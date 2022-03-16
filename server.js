const { sequelize } = require('./utils/database');
const { app } = require('./app');
const { initModels } = require('./utils/initModels');

sequelize
  .authenticate()
  .then(() => {
    console.log('Database authenticate');
  })
  .catch((err) => console.log(err));

initModels();

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  `Express app running on port: ${PORT}`;
});
