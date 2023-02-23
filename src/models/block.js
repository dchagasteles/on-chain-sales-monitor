module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    lastBlockNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
  return Block;
};
