import dotenv from 'dotenv';
require('dotenv').config();
dotenv.config();

import Activity from '../models/activity';
import ActivityHasParticipant from '../models/activity_has_participant';
import logger from '../logger';
import Person from '../models/person';
import PersonType from '../models/person_type';
import Phone from '../models/phone';

import { Op } from 'sequelize';

class ActivityController {
  async store(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      let erros = [];

      const { name, description, start, end, generate_certificate, vacancies } =
        req.body;

      const status_id = 1;

      if (name.length < 3 || name.length > 50) {
        erros.push('Nome da atividade deve ter entre 3 e 50 caracteres');
      }

      var dateEnd;
      var dateStart;

      if (!start) {
        erros.push('Data de Inicio deve ser preenchida ');
      } else {
        var dateStart = new Date(start);
      }

      if (!end) {
        erros.push('Data de Fim deve ser preenchida ');
      } else {
        dateEnd = new Date(end);
      }

      if (dateStart < new Date()) {
        erros.push('Data de Inicio deve ser maior que a data atual ');
      }

      if (dateEnd < new Date()) {
        erros.push('Data de Fim deve ser maior que a atual ');
      }

      if (dateEnd < dateStart) {
        erros.push('Data de Fim deve ser maior que a Data de Início');
      }

      if (!vacancies) {
        erros.push('Número de vagas deve ser preenchido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar usuário', erros });
      } else {
        const newActivity = await Activity.create({
          name,
          description,
          start,
          end,
          generate_certificate,
          vacancies,
          status_id,
        });

        logger.info({
          level: 'info',
          message: `Atividade ${newActivity.name} (id: ${newActivity.id} registrada com sucesso)`,
          label: `Registro - ${userLogged.login}@${userLogged.id}`,
        });

        return res.json({ success: 'Atividade Registrada com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const activities = await Activity.findAll({
      attributes: ['id', 'name', 'start', 'end', 'status_id'],
      order: ['status_id', ['start', 'desc'], ['name', 'asc']],
    });
    res.json(activities);
  }

  async showParticipantSubscriptions(req, res) {
    try {
      const { person_id } = req.params;
      if (!person_id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const person = await Person.findByPk(person_id);
      if (!person) {
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }

      const activities = await ActivityHasParticipant.findAll({
        attributes: [
          'id',
          'registration_date',
          'number_tickets',
          'participation_date',
          'number_participation',
        ],
        include: [
          {
            model: Activity,
            as: 'activity',
            attributes: ['id', 'name', 'start', 'end', 'generate_certificate'],
            where: { status_id: process.env.ACTTIVITY_STATUS_ACTIVE },
          },
        ],
        where: {
          person_id,
        },
        order: [[Activity, 'name', 'asc']],
      });
      return res.json(activities);
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar participantes da atividade`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async filterSubscriptions(req, res) {
    try {
      let { start, end } = req.query;

      const person = await Person.findByPk(person_id);
      if (!person) {
        return res.status(400).json({
          errors: ['Person does not exist'],
        });
      }

      const activities = await ActivityHasParticipant.findAll({
        attributes: [
          'id',
          'registration_date',
          'number_tickets',
          'participation_date',
          'number_participation',
        ],
        include: [
          {
            model: Activity,
            as: 'activity',
            attributes: ['id', 'name', 'start', 'end', 'generate_certificate'],
            where: {
              [Op.and]: [
                { status_id: process.env.ACTTIVITY_STATUS_ACTIVE },
                { start: { [Op.gte]: start } },
                { start: { [Op.lte]: end } },
              ],
            },
          },
        ],
        where: {
          person_id,
        },
        order: [[Activity, 'name', 'asc']],
      });
      res.json(activities);
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar inscrições`,
      });
    }
  }
  async vacanciesAvailable(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Activity does not exist'],
        });
      }

      const participants = await ActivityHasParticipant.sum('number_tickets', {
        where: { activity_id: activity.id },
      });

      const vacanciesAvailable = activity.vacancies - participants;

      res.json(vacanciesAvailable);
    } catch (error) {}
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Activity does not exist'],
        });
      }

      return res.json(activity);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar atividade`,
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
      let erros = [];
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
        if (!activity) {
          return res.status(400).json({
            errors: ['Activity does not exist'],
          });
        }

      let {
        status_id,
        name,
        start, 
        end,
        vacancies,
        isActive,
      } = req.body;

      if (name.length < 3 || name.length > 50) {
        erros.push('Nome da atividade deve ter entre 3 e 50 caracteres');
      }

      var dateEnd;
      var dateStart;

      if (!start) {
        erros.push('Data de Inicio deve ser preenchida ');
      } else {
        var dateStart = new Date(start);
      }

      if (!end) {
        erros.push('Data de Fim deve ser preenchida ');
      } else {
        dateEnd = new Date(end);
      }

      if (dateStart < new Date()) {
        erros.push('Data de Inicio deve ser maior que a data atual ');
      }

      if (dateEnd < new Date()) {
        erros.push('Data de Fim deve ser maior que a atual ');
      }

      if (dateEnd < dateStart) {
        erros.push('Data de Fim deve ser maior que a Data de Início');
      }

      if (!vacancies) {
        erros.push('Número de vagas deve ser preenchido');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar usuário', erros });
      } else {

        if (isActive !== undefined)
        status_id =
          isActive === true
            ? process.env.ACTTIVITY_STATUS_ACTIVE
            : process.env.ACTTIVITY_STATUS_INACTIVE;

        if (status_id) await activity.update({ status_id });
        
        const newActivity = await activity.update({
          name,
          start, 
          end,
          vacancies,
        });

        logger.info({
          level: 'info',
          message: `Atividade id: ${activity.id}, nome: ${activity.name}, inicio ${activity.start}, fim ${activity.end}, vagas ${activity.vacancies}, certificado ${activity.generate_certificate} - (nome: ${newActivity.name}, inicio ${newActivity.start}, fim ${newActivity.end}, vagas ${newActivity.vacancies}, certificado ${newActivity.generate_certificate})`,
          label: `Edição - ${userLogged.login}@${userLogged.id}`,
        });

        return res.json({ success: 'Editado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async confirmSubscription(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      let erros = [];
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const { number_tickets } = req.body;

      const subscription = await ActivityHasParticipant.findByPk(id);
      if (!subscription) {
        return res.status(400).json({
          errors: ['Subscription does not exist'],
        });
      }

      const participants = await ActivityHasParticipant.sum('number_tickets', {
        where: { activity_id: subscription.activity_id },
      });

      const activity = await Activity.findByPk(subscription.activity_id);

      if (number_tickets > activity.vacancies - participants) {
        erros.push('Número de vagas excedido, atualize e tente novamente');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao confirmar participantes', erros });
      } else {
        await subscription.update({ number_tickets: number_tickets });
        return res.json({ success: 'Editado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async confirmParticipation(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      let erros = [];
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const { number_participation } = req.body;

      const subscription = await ActivityHasParticipant.findByPk(id);
      if (!subscription) {
        return res.status(400).json({
          errors: ['Subscription does not exist'],
        });
      }

      if (number_participation > subscription.number_tickets) {
        erros.push('Número de participantes maior que o número de vagas reservado.');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao confirmar participação', erros });
      } else {
        await subscription.update({ number_participation: number_participation, participation_date: new Date() });
        return res.json({ success: 'Editado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Atividade não existe'],
        });
      }
      await activity.update({ status_id: 2 });

      logger.info({
        level: 'info',
        message: `Atividade inativada com sucesso ${activity.name}`,
        label: `Inativação - ${userLogged.login}@${userLogged.id}}`,
      });

      return res.json({ success: 'Atividade inativa' });
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

  async showParticipants(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Activity does not exist'],
        });
      }

      const participants = await ActivityHasParticipant.findAll({
        attributes: [
          'id',
          'registration_date',
          'number_tickets',
          'participation_date',
          'number_participation',
        ],
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
        where: {
          activity_id: activity.id,
        },
        order: [[Person, 'name', 'asc']],
      });

      return res.json(participants);
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar participante`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async showParticipantsTeachers(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Activity does not exist'],
        });
      }

      const participants = await ActivityHasParticipant.findAll({
        attributes: [
          'id',
          'registration_date',
          'number_tickets',
          'participation_date',
          'number_participation',
        ],
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
            where: { type_id: process.env.TEACHER_PERSON_TYPE },
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
        where: {
          activity_id: activity.id,
        },
        order: [[Person, 'name', 'asc']],
      });

      return res.json(participants);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao buscar professor`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async storeParticipants(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);

    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const { participants } = req.body;
      if (!participants.length) {
        return res.status(400).json({
          errors: ['Missing Students'],
        });
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ['Activity does not exist'],
        });
      }

      let erros = [];

      //- E agora salvamos os participantes da atividade
      for (let i = 0; i < participants.length; i++) {
        let person_id = participants[i].id;
        let activity_id = activity.id;
        let registration_date = new Date().toISOString().slice(0, 19);
        let number_ticktes = 1;

        //- Verifica se o participante ja esta registrado na atividade
        let registro = await ActivityHasParticipant.findAll({
          where: {
            activity_id,
            person_id,
          },
        });

        if (!registro || registro.length <= 0) {
          //- Ainda nao possui esse participante nessa atividade, entao registra
          await ActivityHasParticipant.create({
            activity_id,
            person_id,
            registration_date,
            number_ticktes,
          });
        }
      }

      //- Acho que nao precisa salvar esse tipo de log
      /*logger.info({
          level: "info",
          message: `Turma id: ${newTeam.id} nome: ${newTeam.name} registrada com sucesso`,
          label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });*/

      if (erros.length)
        return res.json({
          success: 'Erro ao registrar um ou mais participantes',
          erros,
        });
      else return res.json({ success: 'Registrado com sucesso' });
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registrar, ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async deleteSubscription(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      // const {id} = req.params;
      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const subscription = await ActivityHasParticipant.findByPk(
        subscriptionId
      );
      if (!subscription) {
        return res.status(400).json({
          errors: ['Inscrição não existe'],
        });
      }
      await subscription.destroy();

      logger.info({
        level: 'info',
        message: `Inscrição deletada com sucesso ${subscription.id}`,
        label: `Deletar, ${userLogged.login}@${userLogged.id}`,
      });

      return res.json({ success: 'Inscrição removida' });
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Deletar, ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ActivityController();
