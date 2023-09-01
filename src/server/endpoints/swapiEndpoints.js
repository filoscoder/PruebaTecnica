const { OK } = require('http-status');

const isWookieeFormat = (req) =>
  req.query.format && req.query.format == 'wookiee';

const applySwapiEndpoints = (server, app) => {
  let result = {
    statusCode: OK,
    data: null,
  };

  server.get('/hfswapi/test', async (_req, res, next) => {
    try {
      const data = await app.swapiFunctions.genericRequest(
        'https://swapi.dev/api/',
        'GET',
      );
      res.send(data);
    } catch (error) {
      next(error);
    }
  });

  server.get('/hfswapi/getPeople/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const isWookiee = isWookieeFormat(req);

      const factory = await app.peopleFactory(app, id, isWookiee);
      result.data = factory.getPeople();

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  server.get('/hfswapi/getPlanet/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const factory = await app.planetFactory(app, id);
      result.data = factory.getPlanet();

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res, next) => {
    try {
      const isWookiee = isWookieeFormat(req);
      const { peopleId, planetId } = req.query;

      const PeopleFactory = await app.peopleFactory(app, peopleId, isWookiee);

      const weight = await PeopleFactory.getWeightOnPlanet(planetId);
      result.data = {
        weight,
      };

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  server.get('/hfswapi/getLogs', async (_req, res, next) => {
    try {
      result.data = await app.db.logging.findAll();

      res.send(result);
    } catch (error) {
      next(error);
    }
  });
};

module.exports = applySwapiEndpoints;
