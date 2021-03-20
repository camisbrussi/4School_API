'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('person', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'person_type',
                    key: 'id'
                },
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
            },
            name: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING(11),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('person');
    }
};
