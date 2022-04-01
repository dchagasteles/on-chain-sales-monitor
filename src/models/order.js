module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    transactionHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chainId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  return Order;
};
