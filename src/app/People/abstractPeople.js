const Planet = require('../Planet/Planet');
class AbstractPeople {
  constructor(app, id) {
    if (this.constructor == AbstractPeople) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.id = +id;
    this.app = app;
    this.peopleApi = 'https://swapi.dev/api/people/';
    this.wookieeQuery = '?format=wookiee';
    this.Planet = new Planet(app);
  }

  async init() {
    const dbPeople = await this.getPeopleFromDB(this.id);
    if (!dbPeople) {
      const fetchedPeople = await this.getPeopleFromSwapi(this.id);

      const planetId = fetchedPeople.homeworld.match(/planets\/(.*)\//)[1];
      const fetchedPlanet = await this.Planet.getPlanetFromSwapi(planetId);

      this.homeworldName = fetchedPlanet.name;
      this.homeworldId = planetId;

      // ? Should we saved fetchedPeople?
      // const savedPeople = await this.savePeople(fetchedPeople);
    }
  }

  async getPeopleFromDB(id) {
    const DB = this.app.db;
    const data = await DB.swPeople.findByPk(id);

    if (data) {
      const { name, mass, height, homeworldName, homeworldId } = data;

      this.name = name;
      this.mass = mass;
      this.height = height;
      this.homeworldName = homeworldName;
      this.homeworldId = homeworldId;
    }

    return data;
  }

  async getPeopleFromSwapi(id, isWookiee = false) {
    const apiRequest = this.app.swapiFunctions.genericRequest;
    const query = isWookiee ? this.wookieeQuery : '';
    const fetchedPeople = await apiRequest(
      `${this.peopleApi}${id}${query}`,
      'GET',
    );

    if (
      fetchedPeople?.detail === 'Not found' ||
      fetchedPeople?.wawoaoraahan === 'Nooao wwoohuwhwa'
    ) {
      throw new Error(
        `People id: ${id}, ${
          fetchedPeople?.detail || fetchedPeople?.wawoaoraahan
        }`,
      );
    }

    const { name, mass, height } = fetchedPeople;

    this.name = name;
    this.mass = +mass;
    this.height = +height;

    return fetchedPeople;
  }

  async savePeople(data) {
    const DB = this.app.db;
    const savedPeople = await DB.swPeople.create(data);

    return savedPeople;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getMass() {
    return this.mass;
  }

  getHeight() {
    return this.height;
  }

  getHomeworldName() {
    return this.homeworldName;
  }

  getHomeworlId() {
    return this.homeworldId;
  }

  async getWeightOnPlanet(planetId) {
    await this.Planet.isResident(this.id, planetId);
    const mass = this.getMass();
    const gravity = this.Planet.getGravity();

    return mass * gravity;
  }

  getPeople() {
    return {
      id: this.getId(),
      name: this.getName(),
      mass: this.getMass(),
      height: this.getHeight(),
      homeworldName: this.getHomeworldName(),
      homeworldId: this.getHomeworlId(),
    };
  }
}

module.exports = AbstractPeople;
