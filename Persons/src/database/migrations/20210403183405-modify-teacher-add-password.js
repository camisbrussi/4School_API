'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'teacher',
            'password_hash',
            {
                type: Sequelize.STRING(80),
                allowNull: false,
                after: 'status_id'
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('teacher', 'password');
    }
};