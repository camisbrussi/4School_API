import Sequelize, {Model} from "sequelize";

export default class city extends Model {
    static init(sequelize) {
        super.init(
            {
              description: {
                type: Sequelize.STRING(80),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [3, 80],
                            msg: "Digite um nome de cidade válido",
                        },
                    },
                },
                uf: {
                  type: Sequelize.STRING(2),
                      defaultValue: "",
                      validate: {
                          len: {
                              args: [2],
                              msg: "Digite uma uf válida",
                          },
                      },
                  },
                  state: {
                    type: Sequelize.STRING(80),
                        defaultValue: "",
                        validate: {
                            len: {
                                args: [3, 80],
                                msg: "Digite um estado válido",
                            },
                        },
                    },
            },
            {
                sequelize,
                freezeTableName: true
            }
        );
        return this;
    }
} 