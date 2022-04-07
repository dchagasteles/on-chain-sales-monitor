module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      transactionHash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      price: {
        type: DataTypes.FLOAT,
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
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );
  return Order;
};
