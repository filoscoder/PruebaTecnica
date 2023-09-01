const CommonPeople = require('./CommonPeople');
const WookieePeople = require('./wookieePeople');

const peopleFactory = async (app, id, isWookiee) => {
  let people = null;
  if (isWookiee) {
    people = new WookieePeople(app, id);
  } else {
    people = new CommonPeople(app, id);
  }
  await people.init();
  return people;
};

module.exports = { peopleFactory };
