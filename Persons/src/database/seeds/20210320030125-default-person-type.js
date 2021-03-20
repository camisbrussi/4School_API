'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('person_type',
        [
            {
                description: 'Professor',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                description: 'Responsável',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                description: 'Aluno',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {}
    ),
    down: (queryInterface) => queryInterface.bulkDelete('person_type', null, {})
};
