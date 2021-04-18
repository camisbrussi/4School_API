import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Person from '../models/person';
import Person_type from '../models/person_type';
import Teacher from '../models/teacher';
import Teacher_status from '../models/teacher_status';
import Phone from '../models/phone';
import Responsible from '../models/responsible';
import Student from '../models/student';
import Student_status from '../models/student_status';

const models = [Person, Person_type, Teacher, Teacher_status, Phone, Responsible, Student, Student_status];
const connection = new Sequelize(databaseConfig);

connectionDb();

async function connectionDb() {
  try {
    await connection.authenticate();
  } catch (error) {

    logger.error({
      level: 'error',
      message: error,
      label: `erro de conexão com o banco`
    });

    return res.status(400).json({
      errors: e.errors.map((err) => err.message),
    });
  }
}

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));