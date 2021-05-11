import logger from "../logger";
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Team from '../models/team';
import Teacher from '../models/teacher';
import Person from '../models/person';
import PersonType from '../models/person_type';
import Team_status from '../models/team_status';
import TeamHasStudent from '../models/team_has_student';
import Student from '../models/student';
import StudentStatus from '../models/student_status';
import Responsible from '../models/responsible';

const models = [Team, Teacher, Team_status, Person, PersonType, TeamHasStudent, Student, StudentStatus, Responsible];
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