'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('message', {

            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            person_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'person',
                    key: 'id'
                },
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            number: {
                type: Sequelize.STRING(11),
                allowNull: true
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            send_email: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            send_whatsapp: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            email_sent: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            whatsapp_sent: {
                type: Sequelize.BOOLEAN,
                allowNull: false
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
        return queryInterface.dropTable('phone');
    }
};
