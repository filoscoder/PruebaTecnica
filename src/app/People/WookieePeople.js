const AbstractPeople = require('./AbstractPeople');
const Planet = require('../Planet/Planet');

class WookiePeople extends AbstractPeople {
  constructor(app, id) {
    super(app, id);
    this.isWookiee = true;
    this.Planet = new Planet(app);
  }
  async init() {
    const fetchedWookiePeople = await this.getPeopleFromSwapi(
      this.id,
      this.isWookiee,
    );

    const {
      whrascwo: name,
      scracc: mass,
      acwoahrracao: height,
      acooscwoohoorcanwa: homeworld,
    } = fetchedWookiePeople;

    const planetId = homeworld.match(/akanrawhwoaoc\/(.*)\//)[1];
    const fetchedPlanet = await this.Planet.getPlanetFromSwapi(
      planetId,
      this.isWookiee,
    );

    const { whrascwo: homeworldName } = fetchedPlanet;

    this.name = name;
    this.mass = +mass;
    this.height = +height;
    this.homeworldName = homeworldName;
    this.homeworldId = planetId;
  }
}

module.exports = WookiePeople;
