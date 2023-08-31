const { OK } = require('http-status');

const _isWookieeFormat = (req) =>
  req.query.format && req.query.format == 'wookiee';

const applySwapiEndpoints = (server, app) => {
  const db = app.db;

  server.get('/hfswapi/test', async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      'https://swapi.dev/api/',
      'GET',
      null,
      true,
    );
    res.status(OK).send(data);
  });

  server.get('/hfswapi/getPeople/:id', async (req, res) => {
    let result = {
      statusCode: OK,
      data: null,
    };
    const id = req.params.id;

    const dbPeople = await db.swPeople.findByPk(id);
    if (dbPeople) {
      result.data = dbPeople;
    } else {
      const fetchedPeople = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/people/${id}`,
        'GET',
        null,
        true,
      );
      const { name, mass, height, homeworld } = fetchedPeople;
      const homeworldId = homeworld.match(/planets\/(.*)\//)[1];
      const fetchedHomeWorld = await app.swapiFunctions.genericRequest(
        homeworld,
        'GET',
        null,
        true,
      );
      const { name: homeworldName } = fetchedHomeWorld;

      result.data = {
        name,
        mass,
        height,
        homeworldName,
        homeworldId,
      };
    }

    res.status(result.statusCode).send(result);
  });

  server.get('/hfswapi/getPlanet/:id', async (req, res) => {
    let result = {
      statusCode: OK,
      data: null,
    };
    const id = req.params.id;

    const dbPlanet = await db.swPlanet.findByPk(id);
    if (dbPlanet) {
      result.data = dbPlanet;
    } else {
      const fetchedPlanet = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/planets/${id}`,
        'GET',
        null,
        true,
      );
      const { name, gravity } = fetchedPlanet;
      console.log(fetchedPlanet);

      result.data = {
        name,
        gravity,
      };
    }

    res.status(result.statusCode).send(result);
  });

  server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
    res.status(result.statusCode);
  });

  server.get('/hfswapi/getLogs', async (req, res) => {
    const data = await app.db.logging.findAll();
    res.status(result.statusCode).send(data);
  });
};

module.exports = applySwapiEndpoints;
