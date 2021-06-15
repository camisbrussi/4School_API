import dotenv from "dotenv";
require("dotenv").config();
dotenv.config();

import Message from "../models/message";
import Person from "../models/person";
import logger from "../logger";
import { sender } from "../config/emailConfig";
import PersonType from "../../../Persons/src/models/person_type";
import Phone from "../models/phone";

class SendMailController {
  async index(req, res) {
    try {
      const send = await Message.findAll({
        include: [
          {
            model: Person,
            as: 'person',
            attributes: ['name']
          },
        ],
        order: ["message"],
      });

      return res.json(send);
    } catch (e) {
      logger.error({
        level: "error",
        messages: e.errors.map((err) => err.messages),
        label: `Erro ao listar Mensagens`,
      });

      return res.json(null);
    }
  }

  async send(req, res) {
    try {
      
      const registration_log = await Message.findOne({
        where: { email_sent: 0 },
        //para whats tratar isso
      });

      if (!registration_log) return res.json(null);

      const registration = await Message.findByPk(registration_log.id);

      if (!registration)
        return res.status(400).json({ error: "Mensagem não encontrada" });

      const person = await Person.findByPk(registration.person_id);

      if (!person)
        return res.status(400).json({ error: "Pessoa não encontrado" });

      const mailOption = {
        from: process.env.EMAIL_SENDER,
        to: registration.email,
        subject: "Mensagem da 4School",
        text: registration.message,
      };

      await Message.update(
        {
          email_sent: 1,
        },
        {
          where: { id: registration_log.id },
        },
        console.log(Message)
      );

      sender.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(400).json({ error: "Não foi possível enviar o e-mail" });
        } else {
          return res.status(200).json({ success: "Email enviado com sucesso" });
        }
      });
      
    } catch (e) {
      console.log(e);
      return res.json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      const { destinatarios, message, send_email, send_whatsapp } = req.body;
      if (!destinatarios.length) {
        return res.status(400).json({
          errors: ["Informe os destinatários"],
        });
      }

      //- E agora salvamos os destinatarios da mensagem
      for (let i = 0; i < destinatarios.length; i++) {
        let person_id = destinatarios[i].id;

        const person = await Person.findByPk(person_id,{
          attributes: ['email'],
          include: [
            {
              model: Phone,
              as: 'phones',
              attributes: ['number'],
              where: {
                is_whatsapp: 1
              }
            },
          ],
        });

        let email = send_email ? person.email : null;
        let number = send_whatsapp && person.phones.length ? person.phones[0].number : null;

        if (email != null || number != null) {
          //- Cria a mensagem
          await Message.create({
            person_id,
            email,
            number,
            message,
            send_email: send_email,
            send_whatsapp: send_whatsapp,
          });
        }
      }

      return res.json({ success: "Enviado com sucesso" });
    } catch (e) {
      console.log(e);
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Envio, ${userLogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new SendMailController();
