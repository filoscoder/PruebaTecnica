const AbstractPeople = require('./AbstractPeople');

class CommonPeople extends AbstractPeople {
  constructor(app, id) {
    super(app, id);
  }
}

module.exports = CommonPeople;
