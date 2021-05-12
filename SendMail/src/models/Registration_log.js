import Sequelize, { Model } from "sequelize";


export default class Registration_log extends Model {
  static init(sequelize) {
    super.init(
      {
        registration_id: {
          type: Sequelize.INTEGER,
          defaultValue: "",
          references: {
            model: "registrations",
            key: "id",
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
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        mail_send: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },

      },
      {
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Registration, {
        foreignKey: "registration_id",
        as: "registration",
      });
    }
  }

