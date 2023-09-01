const db = require('./db');
const swapiFunctions = require('./swapiFunctions');
const { peopleFactory } = require('./People');
const { planetFactory } = require('./Planet');

module.exports = {
  db,
  swapiFunctions,
  peopleFactory,
  planetFactory,
};
