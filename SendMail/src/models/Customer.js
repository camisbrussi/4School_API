import Sequelize, { Model } from "sequelize";

export default class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 255],
              msg: "Campo nome deve ter entre 3 e 255 caracteres",
            },
          },
        },
        cpf: {
          type: Sequelize.STRING(11),
          defaultValue: '',
          unique: {
            msg: "cpf já cadastrado",
          },
          validate: {
            customValidator(value) {
              if (!validarCpf(value)) {
                throw new Error("CPF inválido");
              }
            },
          },
        },
        birth_date: {
          type: Sequelize.DATEONLY,
          defaultValue: '',
          validate: {
            isDate: {
              msg: "Data Inválida",
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            isEmail: {
              msg: "E-mail inválido",
            },
          },
        },
        phone: {
          type: Sequelize.STRING(11),
          allowNull: true,
          validate: {
            len: {
              args: [10, 11],
              msg: "Telefone inválido",
            },
          },
        },
      },
      {
        sequelize,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Registration, {
      foreignKey: "customer_id",
      as: "customers",
    });
  }
}

