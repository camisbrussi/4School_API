import dotenv from 'dotenv';
import logger from '../logger';
import { cpf as cpfIsValid } from 'cpf-cnpj-validator';

require('dotenv').config();
dotenv.config();

import Teacher from '../models/teacher';
import TeacherStatus from '../models/teacher_status';
import Person from '../models/person';
import Address from '../models/adress';
import PersonType from '../models/person_type';
import Phone from '../models/phone';
import { Op } from 'sequelize';
import { Unformatted } from '../util/unformatted';

class TeacherController {
  async store(req, res) {
    
    const { userlogged, iduserlogged } = req.headers;

    try {
      
      let erros = [];
      
      const {
        name,
        cpf,
        email,
        birth_date,
        phones,
        password,
        cep,
        address,
        number,
        complement,
        district,
        city_id,
      } = req.body;
      
      const type_id = process.env.TEACHER_PERSON_TYPE;
      const status_id = process.env.TEACHER_STATUS_ACTIVE;
      console.log("chegou")
      console.log('CPF' + Unformatted(cpf));

      const cpfExists = await Person.findOne({
        where: { cpf: Unformatted(cpf) },
      });

      if (cpfExists) {
        erros.push('CPF já cadastrado');
      }

      if (!cpfIsValid.isValid(Unformatted(cpf))) {
        erros.push('Digite um CPF válido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar professor', erros });
      } else {
        const person = await Person.create({
          type_id,
          name,
          cpf: Unformatted(cpf),
          email,
          birth_date,
        });
        const person_id = person.id;
        await Teacher.create({ person_id, status_id, password });
        await Address.create({
          cep: Unformatted(cep),
          address,
          number,
          complement,
          district,
          city_id,
          person_id,
        });

        if (phones) {
          phones.map((v, k) => {
            let { number, is_whatsapp } = v;
            Phone.create({
              person_id,
              number: Unformatted(number),
              is_whatsapp,
            });
          });
        }

        logger.info({
          level: 'info',
          message: `Professor ${person.name} (id: ${person.id})registrado com sucesso`,
          label: `Registro - ${userlogged}@${iduserlogged}`,
        });

        return res.json({ success: 'Registrado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });
      return res.json({
        success: 'Erro ao registrar professor',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const teachers = await Teacher.findAll({
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
            model: TeacherStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
        order: ['status_id', [Person, 'name', 'asc']],
      });

      res.json(teachers);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Listar - ${userlogged}@${iduserlogged}`,
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

      const teacher = await Teacher.findByPk(id, {
        attributes: ['id', 'status_id'],
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
              {
                model: Address,
                as: 'address',
                attributes: [
                  'id',
                  'address',
                  'number',
                  'complement',
                  'district',
                  'cep',
                  'city_id',
                ],
              },
            ],
          },
          {
            model: TeacherStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
      });
      if (!teacher) {
        return res.status(400).json({
          errors: ['Teacher does not exist'],
        });
      }
      return res.json(teacher);
    } catch (e) {
      console.log(e);
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
        password,
        cep,
        address,
        number,
        complement,
        district,
        city_id,
        isActive,
      } = req.body;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(400).json({
          errors: ['Teacher does not exist'],
        });
      }

      const person = await Person.findByPk(teacher.person_id);
      if (!person) {
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }

      const cpfExists = await Person.findOne({
        where: { cpf: Unformatted(cpf) },
      });

      if (cpfExists && Unformatted(cpf) != person.cpf) {
        erros.push('CPF já cadastrado');
      }

      if (!cpfIsValid.isValid(Unformatted(cpf))) {
        erros.push('Digite um CPF válido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar usuário', erros });
      } else {
        if (isActive !== undefined)
          status_id =
            isActive === true
              ? process.env.TEACHER_STATUS_ACTIVE
              : process.env.TEACHER_STATUS_INACTIVE;
        if (status_id) await teacher.update({ status_id });

        if (password) {
          await teacher.update({ password });
        }
        const newData = await person.update({
          name,
          cpf: Unformatted(cpf),
          email,
          birth_date,
        });

        await Phone.destroy({
          where: { person_id: person.id },
        });

        if (phones) {
          phones.map((v, k) => {
            let { number, is_whatsapp } = v;
            const numberUnformatted = number
              .replace('(', '')
              .replace(')', '')
              .replace('-', '');
            console.log(numberUnformatted);
            Phone.create({
              person_id: person.id,
              number: numberUnformatted,
              is_whatsapp,
            });
          });
        }

        await Address.destroy({
          where: { person_id: person.id },
        });

        await Address.create({
          cep: Unformatted(cep),
          address,
          number,
          complement,
          district,
          city_id,
          person_id: teacher.person_id,
        });

        logger.info({
          level: 'info',
          message: `Professor id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
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
        success: 'Erro ao registrar professor',
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

      const teacher = await Teacher.findByPk(id);
      const person = await Person.findByPk(id);
      if (!teacher) {
        return res.status(400).json({
          errors: ['Teacher does not exist'],
        });
      }
      await teacher.update({ status_id: process.env.TEACHER_STATUS_INACTIVE });

      logger.info({
        level: 'info',
        message: `Professor inativado com sucesso id: ${id}, nome ${person.name}`,
        label: `Exclusão - ${userlogged}@${iduserlogged}`,
      });

      return res.json('Teacher inactive');
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Exclusão - ${userlogged}@${iduserlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async indexFilter(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      let { status_id, name, cpf, yearBirth } = req.query;

      let whereTeacher = {};
      let whereTeacherPerson = {};

      if (status_id) whereTeacher.status_id = status_id;

      if (name) whereTeacherPerson.name = { [Op.substring]: name };
      if (cpf) whereTeacherPerson.cpf = cpf;
      if (yearBirth)
        whereTeacherPerson.birth_date = {
          [Op.between]: [yearBirth + '-01-01', yearBirth + '-12-31'],
        };

      const teachers = await Teacher.findAll({
        attributes: ['id'],
        where: whereTeacher,
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            where: whereTeacherPerson,
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
            model: TeacherStatus,
            as: 'status',
            attributes: ['id', 'description'],
          },
        ],
        order: ['status_id', [Person, 'name', 'asc']],
      });

      res.json(teachers);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Buscar, ${iduserlogged}, ${userlogged}`,
      });
    }
  }
}

export default new TeacherController();
