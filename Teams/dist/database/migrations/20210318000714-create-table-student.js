"use strict";'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('student', {
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
            responsible_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'responsible',
                    key: 'id'
                },
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
            },
            status_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'student_status',
                    key: 'id'
                },
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
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
        return queryInterface.dropTable('student');
    }
};
