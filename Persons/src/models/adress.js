import Sequelize, { Model } from 'sequelize';

export default class address extends Model {
  static init(sequelize) {
    super.init(
      {
        address: {
          type: Sequelize.STRING(80),
          defaultValue: '',
          validate: {
            len: {
              args: [3, 80],
              msg: 'Digite um endereço entre 3 e 80 caracteres',
            },
          },
        },
        number: {
          type: Sequelize.STRING(80),
          defaultValue: '',
        },
        complement: {
          type: Sequelize.STRING(80),
          defaultValue: '',
        },
        district: {
          type: Sequelize.STRING(80),
          defaultValue: '',
        },
        cep: {
          type: Sequelize.STRING(8),
          defaultValue: '',
        },
      },
      {
        sequelize,
        freezeTableName: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.person, { foreignKey: 'person_id', as: 'person' });
    this.belongsTo(models.city, { foreignKey: 'city_id', as: 'city' });
  }
}
