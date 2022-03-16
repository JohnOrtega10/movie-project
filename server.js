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

app.listen(4000, () => {
  console.log('App running');
});
