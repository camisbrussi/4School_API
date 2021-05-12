import Sequelize, { Model } from "sequelize";

export default class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "Campo nome deve ter entre 3 e 255 caracteres",
            },
          },
        },
        description: {
          type: Sequelize.TEXT,
          defaultValue: "",
          len: {
            args: [3, 255],
            msg: "Campo nome deve ter entre 3 e 255 caracteres",
          },
        },
        date: {
          type: Sequelize.DATE,
          defaultValue: "",
          validate: {
            isDate: {
              msg: "Data Inválida",
            },
          },
        },
        places: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Registration, {
      foreignKey: "event_id",
      as: "events",
    });
  }
}
