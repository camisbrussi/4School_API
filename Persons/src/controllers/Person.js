import Person from '../models/person';
import logger from '../logger';
import { Op } from 'sequelize';
import PersonType from '../models/person_type';
import { Unformatted } from '../util/unformatted';

class PersonController {
  async store(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      let erros = [];
      const { type, name, cpf, email, birth_date } = req.body;s

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
        const newPerson = await Person.create({
          type,
          name,
          cpf: Unformatted(cpf),
          email,
          birth_date,
        });

        logger.info({
          level: 'info',
          message: `Pessoa ${newPerson.name} (id: ${newPerson.id}) registrada com sucesso`,
          label: `Registro - ${userLogged.login}@${userLogged.id}`,
        });

        return res.json({ success: 'Pessoa registrada com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userLogged.login}@${userLogged.id}`,
      });

      return res.json({
        success: 'Erro ao registrar professor',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const persons = await Person.findAll({
        attributes: ['id', 'type', 'name', 'cpf', 'email', 'birth_date'],
        order: ['name'],
      });
      res.json(persons);
    } catch (error) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar pessoas`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }
      const person = await Person.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }
      return res.json(person);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar Pessoa`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const person = await Person.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }

      const newData = await person.update(req.body);

      logger.info({
        level: 'info',
        message: `Pessoa id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
        label: `Edição - ${userLogged.login}@${userLogged.id}`,
      });

      return res.json({ success: 'Editado com sucesso' });
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      return res.json('Pessoa não pode ser inativa');
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Inativação - ${userLogged.login}@${userLogged.id}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async filter(req, res) {
    try {
      let { type_id, name } = req.query;
      let where = {};

      if (type_id && parseInt(type_id)) where.type_id = type_id;
      if (name && name.length) where.name = { [Op.substring]: name };

      const persons = await Person.findAll({
        attributes: ['id', 'type_id', 'name', 'cpf', 'email', 'birth_date'],
        where: where,
        include: [
          {
            model: PersonType,
            as: 'type',
            attributes: ['id', 'description'],
          },
        ],
        order: ['name'],
      });
      res.json(persons);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro no filtro de pessoas}`,
      });
    }
  }
}
export default new PersonController();
