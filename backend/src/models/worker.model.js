const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize) => {
  const Worker = sequelize.define(
    "Worker",
    {
      image: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      email: {
        type: DataTypes.STRING(150),
        unique: true,
      },
      name: DataTypes.STRING,
      position: DataTypes.STRING,
      date_hired: DataTypes.DATE,
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("password_hash", bcrypt.hashSync(value, 10));
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "inactive",
      },
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    { 
      tableName: 'Worker',   // 👈 Forcer la majuscule dans la BDD
      timestamps: true,
      createdAt: "created_at",
    }
  );
  return Worker;
};
