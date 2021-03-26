import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Team from '../models/team';
import Teacher from '../models/teacher';
import Person from '../models/person';
import Team_status from '../models/team_status';


const models = [Team, Teacher, Team_status, Person];
const connection = new Sequelize(databaseConfig);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));