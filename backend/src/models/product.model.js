module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      Prod_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      entreprise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Prod_Description: {
        type: DataTypes.TEXT,
      },
      code_bar: {
        type: DataTypes.STRING,
      },
      date_of_arrival: {
        type: DataTypes.DATE,
      },
      Prod_image: {
        type: DataTypes.STRING,
      },
      min_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      max_stock_level: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "Products",
      freezeTableName: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['Prod_name', 'entreprise_id'],
        },
      ],
    }
  );

  return Product;
};
