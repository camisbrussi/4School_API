import Sequelize, { Model } from "sequelize";

export default class message extends Model {
  static init(sequelize) {
    super.init(
      {
        person_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "person",
            key: "id",
          },
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
          defaultValue: "",
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: ""
        },
        number: {
          type: Sequelize.STRING(11),
          allowNull: true,
          defaultValue: ""
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            len: {
              args: [3, 65000],
              msg: "Mensagem deve ser maior que 3 caracteres"
            },
          },
          defaultValue: ""
        },
        send_email: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: ""
        },
        send_whatsapp: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: ""
        },
        email_sent: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0
        },
        whatsapp_sent: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      },
      {
        sequelize,
        freezeTableName: true
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.person, {foreignKey: "person_id", as:"person"});
}
}
