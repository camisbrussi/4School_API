import dotenv from 'dotenv';
import logger from '../logger';
import { cpf as cpfIsValid } from 'cpf-cnpj-validator';

require('dotenv').config();
dotenv.config();

import Student from '../models/student';
import StudentStatus from '../models/student_status';
import Responsible from '../models/responsible';
import Person from '../models/person';
import PersonType from '../models/person_type';
import Phone from '../models/phone';
import { Op } from 'sequelize';

class StudentController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      let erros = [];

      const { responsible_id, name, cpf, email, birth_date, phones } = req.body;
      const type_id = process.env.STUDENT_PERSON_TYPE;
      const status_id = process.env.STUDENT_STATUS_ACTIVE;

      const cpfUnformatted = cpf
        .replace('.', '')
        .replace('.', '')
        .replace('-', '');

      const cpfExists = await Person.findOne({
        where: { cpf: cpfUnformatted },
      });

      if (cpfExists) {
        erros.push('CPF já cadastrado');
      }

      if (!cpfIsValid.isValid(cpfUnformatted)) {
        erros.push('Digite um CPF válido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar estudante', erros });
      } else {
        const person = await Person.create({
          type_id,
          name,
          cpf: cpfUnformatted,
          email,
          birth_date,
        });
        const person_id = person.id;
        await Student.create({ person_id, responsible_id, status_id });

        if (phones) {
          phones.map((v, k) => {
            let { number, is_whatsapp } = v;
            Phone.create({ person_id, number, is_whatsapp });
          });
        }

        logger.info({
          level: 'info',
          message: `Estudante ${name} (id: ${person_id})registrado com sucesso`,
          label: `Registro - ${userlogged}@${iduserlogged}`,
        });

        return res.json({ success: 'Registrado com sucesso' });
      }
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({
        success: 'Erro ao registrar estudante',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const students = await Student.findAll({
        attributes: ['id'],
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            include: [
              {
                model: PersonType,
                as: 'type',
                attributes: ['id', 'description'],
              },
              {
                model: Phone,
                as: 'phones',
                attributes: ['id', 'number', 'is_whatsapp'],
              },
            ],
          },
          {
            model: Responsible,
            as: 'responsible',
            attributes: ['id'],
            include: [
              {
                model: Person,
                as: 'person',
                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                include: [
                  {
                    model: PersonType,
                    as: 'type',
                    attributes: ['id', 'description'],
                  },
                  {
                    model: Phone,
                    as: 'phones',
                    attributes: ['id', 'number', 'is_whatsapp'],
                  },
                ],
              },
            ],
          },
          {
            model: StudentStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
        order: ['status_id', [Person, 'name', 'asc']],
      });

      res.json(students);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Listar - ${userlogged}@${iduserlogged}`,
      });
    }
  }

  async indexResponsible(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { responsible_id } = req.params;
      if (!responsible_id) {
        return res.status(400).json({
          errors: ['Missing Responsible ID'],
        });
      }

      const students = await Student.findAll({
        attributes: ['id'],
        where: { responsible_id },
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            include: [
              {
                model: PersonType,
                as: 'type',
                attributes: ['id', 'description'],
              },
              {
                model: Phone,
                as: 'phones',
                attributes: ['id', 'number', 'is_whatsapp'],
              },
            ],
          },
          {
            model: Responsible,
            as: 'responsible',
            attributes: ['id'],
            include: [
              {
                model: Person,
                as: 'person',
                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                include: [
                  {
                    model: PersonType,
                    as: 'type',
                    attributes: ['id', 'description'],
                  },
                  {
                    model: Phone,
                    as: 'phones',
                    attributes: ['id', 'number', 'is_whatsapp'],
                  },
                ],
              },
            ],
          },
          {
            model: StudentStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
        order: ['status_id', [Person, 'name', 'asc']],
      });

      res.json(students);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Buscar - ${userlogged}@${iduserlogged}`,
      });
    }
  }

  async indexFilter(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      let { status_id, name, cpf, yearBirth } = req.query;

      let whereStudent = {};
      let whereStudentPerson = {};

      if (status_id) whereStudent.status_id = status_id;

      if (name) whereStudentPerson.name = { [Op.substring]: name };
      if (cpf) whereStudentPerson.cpf = cpf;
      if (yearBirth)
        whereStudentPerson.birth_date = {
          [Op.between]: [yearBirth + '-01-01', yearBirth + '-12-31'],
        };

      const students = await Student.findAll({
        attributes: ['id'],
        where: whereStudent,
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            where: whereStudentPerson,
            include: [
              {
                model: PersonType,
                as: 'type',
                attributes: ['id', 'description'],
              },
              {
                model: Phone,
                as: 'phones',
                attributes: ['id', 'number', 'is_whatsapp'],
              },
            ],
          },
          {
            model: Responsible,
            as: 'responsible',
            attributes: ['id'],
            include: [
              {
                model: Person,
                as: 'person',
                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                include: [
                  {
                    model: PersonType,
                    as: 'type',
                    attributes: ['id', 'description'],
                  },
                  {
                    model: Phone,
                    as: 'phones',
                    attributes: ['id', 'number', 'is_whatsapp'],
                  },
                ],
              },
            ],
          },
          {
            model: StudentStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
        order: ['status_id', [Person, 'name', 'asc']],
      });

      res.json(students);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Buscar - ${userlogged}@${iduserlogged}`,
      });
    }
  }

  async show(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const student = await Student.findByPk(id, {
        attributes: ['id'],
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            include: [
              {
                model: PersonType,
                as: 'type',
                attributes: ['id', 'description'],
              },
              {
                model: Phone,
                as: 'phones',
                attributes: ['id', 'number', 'is_whatsapp'],
              },
            ],
          },
          {
            model: Responsible,
            as: 'responsible',
            attributes: ['id'],
            include: [
              {
                model: Person,
                as: 'person',
                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                include: [
                  {
                    model: PersonType,
                    as: 'type',
                    attributes: ['id', 'description'],
                  },
                  {
                    model: Phone,
                    as: 'phones',
                    attributes: ['id', 'number', 'is_whatsapp'],
                  },
                ],
              },
            ],
          },
          {
            model: StudentStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
      });
      if (!student) {
        return res.status(400).json({
          errors: ['Student does not exist'],
        });
      }
      return res.json(student);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Buscar - ${userlogged}@${iduserlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;

      let erros = [];
      let {
        status_id,
        name,
        cpf,
        email,
        birth_date,
        phones,
        isActive,
      } = req.body;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const student = await Student.findByPk(id);
      if (!student) {
        return res.status(400).json({
          errors: ['Student does not exist'],
        });
      }

      const person = await Person.findByPk(student.person_id);
      if (!person) {
        Logger.error(e.errors.map((err) => err.message));
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }

      const cpfUnformatted = cpf
        .replace('.', '')
        .replace('.', '')
        .replace('-', '');

      const cpfExists = await Person.findOne({
        where: { cpf: cpfUnformatted },
      });

      if (cpfExists && cpfUnformatted != person.cpf) {
        erros.push('CPF já cadastrado');
      }

      if (!cpfIsValid.isValid(cpfUnformatted)) {
        erros.push('Digite um CPF válido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar responsável', erros });
      } else {
        const newData = await person.update({ name, cpf: cpfUnformatted, email, birth_date });

        if (isActive !== undefined)
          status_id =
            isActive === true
              ? process.env.STUDENT_STATUS_ACTIVE
              : process.env.STUDENT_STATUS_INACTIVE;
        if (status_id) await student.update({ status_id });

        await Phone.destroy({
          where: { person_id: person.id },
        });

        if (phones) {
          await phones.map((v, k) => {
            let { number, is_whatsapp } = v;
            Phone.create({ person_id: person.id, number, is_whatsapp });
          });
        }

        logger.info({
          level: 'info',
          message: `Estudante id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
          label: `Edição - ${userlogged}@${iduserlogged}`,
        });

        return res.json({ success: 'Editado com sucesso' });
      }
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });
      return res.json({
        success: 'Erro ao registrar estudante',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const student = await Student.findByPk(id);
      const person = await Person.findByPk(id);
      if (!student) {
        return res.status(400).json({
          errors: ['Student does not exist'],
        });
      }
      await student.update({ status_id: process.env.STUDENT_STATUS_INACTIVE });

      logger.info({
        level: 'info',
        message: `Estudante inativado com sucesso id: ${id}, nome: ${person.name}`,
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });

      return res.json('Student inactive');
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new StudentController();
