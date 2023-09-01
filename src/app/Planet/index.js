const Planet = require('./Planet');

const planetFactory = async (app, id) => {
  const planet = new Planet(app, id);

  await planet.init();
  return planet;
};

module.exports = { planetFactory };
