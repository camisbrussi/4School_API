"use strict";module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('activity_has_participant', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'activity',
                    key: 'id'
                },
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
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
            registration_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            number_tickets: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            participation_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            number_participation: {
                type: Sequelize.INTEGER,
                allowNull: true
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
    down: (queryInterface) => {
        return queryInterface.dropTable('activity_has_participant');
    }
};
