module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('Price', {
    nftId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    etherPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usdPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  Price.associate = function (models) {
    models.Price.belongsTo(models.Nft, { foreignKey: 'nftId' });
  };
  return Price;
};
