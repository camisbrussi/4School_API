import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Person from '../models/person'
import Person_type from '../models/person_type'
import Teacher from '../models/teacher'
import Teacher_status from '../models/teacher_status'

const models = [Person, Person_type, Teacher, Teacher_status];
const connection = new Sequelize(databaseConfig);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));