import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import message from '../models/message';
import person from '../models/person';

const models = [message, person];


const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));

message.associate(connection.models);


