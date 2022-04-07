module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Log',
    {
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      msg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );
  return Log;
};
