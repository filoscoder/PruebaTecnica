'use strict';

module.exports = (sequelize, DataTypes) => {
  const swPeople = sequelize.define(
    'swPeople',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      mass: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      homeworldName: DataTypes.STRING,
      homeworldId: DataTypes.STRING,
    },
    {
      paranoid: true,
    },
  );
  return swPeople;
};
