module.exports = (sequelize, DataTypes) => {
  const Nft = sequelize.define('Nft', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chain: {
      type: DataTypes.STRING,
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
  Nft.associate = function (models) {
    // associations can be defined here
  };
  return Nft;
};
