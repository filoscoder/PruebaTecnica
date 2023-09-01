const { ValidationError } = require('../../helpers/errors');

class Planet {
  constructor(app, id) {
    this.id = +id;
    this.db = app.db;
    this.genericRequest = app.swapiFunctions.genericRequest;
    this.planetApi = 'https://swapi.dev/api/planets/';
    this.wookieeQuery = '?format=wookiee';
  }

  async init() {
    let data;
    const dbPlanet = await this.getPlanetFromDB(this.id);
    if (!dbPlanet) {
      data = await this.getPlanetFromSwapi(this.id);

      // ? Should we saved fetched data?
      // const savedPlanet = await this.savePlanet(data);
    }
  }

  async getPlanetFromDB(id) {
    const planet = await this.db.swPlanet.findByPk(id);

    if (planet) {
      const { name, gravity } = planet;

      this.name = name;
      this.gravity = gravity;
    }

    return planet;
  }

  async getPlanetFromSwapi(id, isWookiee = false) {
    const query = isWookiee ? this.wookieeQuery : '';
    const fetchedPlanet = await this.genericRequest(
      `${this.planetApi}${id}${query}`,
      'GET',
    );

    if (
      fetchedPlanet?.detail === 'Not found' ||
      fetchedPlanet?.wawoaoraahan === 'Nooao wwoohuwhwa'
    ) {
      throw new Error(
        `Planet id: ${id}, ${
          fetchedPlanet?.detail || fetchedPlanet?.wawoaoraahan
        }`,
      );
    }

    const { name, gravity, whrascwo, rrrcrahoahaoro } = fetchedPlanet;

    this.name = name || whrascwo;
    this.gravity = this.extractGravity(gravity || rrrcrahoahaoro);

    return fetchedPlanet;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  extractGravity(gravityString) {
    if (!gravityString.includes('standard')) {
      return 0;
    }
    const gravityValue = gravityString.match(/(.*) standard/)[1];

    return +gravityValue;
  }

  getGravity() {
    return this.gravity;
  }

  getPlanet() {
    return {
      id: this.getId(),
      name: this.getName(),
      gravity: this.getGravity(),
    };
  }

  async isResident(peopleId, planetId) {
    const planet = await this.getPlanetFromSwapi(planetId);
    const residentIds = planet.residents.map((residentUrl) => {
      const residentId = residentUrl.match(/people\/(.*)\//)[1];

      return +residentId;
    });
    if (residentIds.includes(peopleId)) {
      throw new ValidationError(
        `El personaje: ${peopleId}, esta en su Planeta natal: ${this.name}`,
      );
    }
  }
}

module.exports = Planet;
