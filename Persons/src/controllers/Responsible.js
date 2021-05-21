import dotenv from 'dotenv';
import logger from '../logger';
import { cpf as cpfIsValid } from 'cpf-cnpj-validator';

require('dotenv').config();
dotenv.config();

import Responsible from '../models/responsible';
import Person from '../models/person';
import PersonType from '../models/person_type';
import Address from '../models/adress';
import Phone from '../models/phone';
import { Unformatted } from '../util/unformatted';

class ResponsibleController {
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
      const type_id = process.env.RESPONSIBLE_PERSON_TYPE;

      const cpfExists = await Person.findOne({
        where: { cpf: Unformatted(cpf) },
      });

      if (cpfExists) {
        erros.push('CPF já cadastrado');
      }

      if (!cpfIsValid.isValid(Unformatted(cpf))) {
        erros.push('Digite um CPF válido');
      }

      if (password.length < 6 || password.length > 50) {
        erros.push('Senha deve ter entre 6 e 50 caracteres');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar Responsável', erros });
      } else {
        const person = await Person.create({
          type_id,
          name,
          cpf: Unformatted(cpf),
          email,
          birth_date,
        });

        const person_id = person.id;
        const responsible = await Responsible.create(
          { person_id, password },
          { logging: console.log }
        );

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
          message: `Responsável id: ${name} (id: ${person_id}) registrado com sucesso`,
          label: `Registro - ${userlogged}@${iduserlogged}`,
        });

        return res.json({
          success: 'Registrado com sucesso',
          responsible_id: responsible.id,
        });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });
      return res.json({
        success: 'Erro ao registrar responsável',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const responsibles = await Responsible.findAll({
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
        order: [[Person, 'name', 'asc']],
      });

      res.json(responsibles);
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

      const responsible = await Responsible.findByPk(id, {
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
        ],
      });
      if (!responsible) {
        return res.status(400).json({
          errors: ['Responsible does not exist'],
        });
      }
      return res.json(responsible);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Busca - ${userlogged}@${iduserlogged}`,
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

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const responsible = await Responsible.findByPk(id);
      if (!responsible) {
        return res.status(400).json({
          errors: ['Responsible does not exist'],
        });
      }

      const person = await Person.findByPk(responsible.person_id);
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

      if (password.length < 6 || password.length > 50) {
        erros.push('Senha deve ter entre 6 e 50 caracteres');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar responsável', erros });
      } else {
        const newData = await person.update({
          name,
          cpf: Unformatted(cpf),
          email,
          birth_date,
        });

        if (password) {
          await responsible.update({ password });
        }

        await Phone.destroy({
          where: { person_id: person.id },
        });

        if (phones) {
          await phones.map((v, k) => {
            let { number, is_whatsapp } = v;
            Phone.create({ person_id: person.id, number, is_whatsapp });
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
          person_id: responsible.person_id,
        });

        logger.info({
          level: 'info',
          message: `Responsável id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
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
        success: 'Erro ao registrar responsável',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    return res.json('Não é possível remover responsáveis');

    /*
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const responsible = await Responsible.findByPk(id);
            if (!responsible) {
                return res.status(400).json({
                    errors: ["Responsible does not exist"],
                });
            }
            await responsible.update({status_id: process.env.});
            return res.json('Responsible inactive');
        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }*/
  }
}

export default new ResponsibleController();
