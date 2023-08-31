const { OK } = require('http-status');

const _isWookieeFormat = (req) =>
  req.query.format && req.query.format == 'wookiee';

const applySwapiEndpoints = (server, app) => {
  const db = app.db;
  let result = {
    statusCode: OK,
    data: null,
  };

  server.get('/hfswapi/test', async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      'https://swapi.dev/api/',
      'GET',
    );
    res.send(data);
  });

  server.get('/hfswapi/getPeople/:id', async (req, res) => {
    const id = req.params.id;

    const dbPeople = await db.swPeople.findByPk(id);
    if (dbPeople) {
      result.data = dbPeople;
    } else {
      const fetchedPeople = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/people/${id}`,
        'GET',
      );
      const { name, mass, height, homeworld } = fetchedPeople;
      const homeworldId = homeworld.match(/planets\/(.*)\//)[1];
      const fetchedHomeWorld = await app.swapiFunctions.genericRequest(
        homeworld,
        'GET',
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

    res.send(result);
  });

  server.get('/hfswapi/getPlanet/:id', async (req, res) => {
    const id = req.params.id;

    const dbPlanet = await db.swPlanet.findByPk(id);
    if (dbPlanet) {
      result.data = dbPlanet;
    } else {
      const fetchedPlanet = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/planets/${id}`,
        'GET',
      );
      const { name, gravity } = fetchedPlanet;

      result.data = {
        name,
        gravity,
      };
    }

    res.send(result);
  });

  server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
    const { peopleId, planetId } = req.query;

    let people;
    let planet;

    const dbPeople = await db.swPeople.findByPk(peopleId);
    if (dbPeople) {
      people = dbPeople;
    } else {
      people = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/people/${peopleId}`,
        'GET',
      );
    }

    const dbPlanet = await db.swPlanet.findByPk(planetId);
    if (dbPlanet) {
      planet = dbPlanet;
    } else {
      planet = await app.swapiFunctions.genericRequest(
        `https://swapi.dev/api/planets/${planetId}`,
        'GET',
        null,
        true,
      );
    }

    const mass = +people.mass;
    const gravity = +planet.gravity.replace(' standard', '');
    const weight = app.swapiFunctions.getWeightOnPlanet(mass, gravity);
    result.data = {
      weight,
    };

    res.status(result.statusCode).send(result);
  });

  server.get('/hfswapi/getLogs', async (req, res) => {
    result.data = await app.db.logging.findAll();

    res.send(result);
  });
};

module.exports = applySwapiEndpoints;
