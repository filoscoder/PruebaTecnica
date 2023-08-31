const express = require('express');
const applyEndpoints = require('./endpoints');
const middlewares = require('./middlewares');

const createExpressServer = async (app) => {
  const server = express();
  server.use(middlewares.logging(app.db));
  applyEndpoints(server, app);
  server.use(middlewares.globalErrorHandler);

  await app.db.initDB();

  server.get('/', async (req, res) => {
    if (process.env.NODE_ENV === 'develop') {
      res.send('Test Enviroment');
    } else {
      res.sendStatus(200);
    }
  });

  return server;
};

module.exports = createExpressServer;
