import Sequelize, { Model } from "sequelize";

export default class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        customer_id: {
          type: Sequelize.INTEGER,
          defaultValue: "",
          references: {
            model: "customers",
            key: "id",
          },
        },
        event_id: {
          type: Sequelize.INTEGER,
          defaultValue: "",
          references: {
            model: "events",
            key: "id",
          },
        },
        auth_key: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "events",
    })
    this.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    })
    this.hasMany(models.Registration_log, {
      foreignKey: "registration_id",
      as: "registration_id",
    });
  }
}