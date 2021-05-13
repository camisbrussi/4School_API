
import dotenv from "dotenv"
require("dotenv").config();
dotenv.config();

import Message from "../models/message";
import Person from "../models/person";
import logger from "../logger";
import { sender } from "../config/emailConfig";


class SendMailController {
  async index(req, res) {}

  async send(req, res) {
    try {
      console.log("cheguei");
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

      console.log(mailOption);
      sender.sendMail(mailOption, function (error, info) {
        if (error) {
          return res.json({ error: "Não foi possível enviar o e-mail" });
        }
      });

      await Message.update(
        {
          email_sent: 1,
        },
        {
          where: { id: registration_log.id },
        }
      );

      return res.json({ success: "Email enviado com sucesso" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const { destinatarios, message } = req.body;
      if (!destinatarios.length) {
        return res.status(400).json({
          errors: ["Missing Students"],
        });
      }

      let erros = [];

      //- E agora salvamos os participantes da atividade
      for (let i = 0; i < destinatarios.length; i++) {
        let person_id = destinatarios[i].id;

        const { email } = await Person.findByPk(person_id);

        //- Ainda nao possui esse participante nessa atividade, entao registra
        await Message.create({
          person_id,
          email,
          message,
          send_email: 1,
          send_whatsapp: 0,
        });
      }

      if (erros.length)
        return res.json({
          success: "Erro ao enviar e-mail",
          erros,
        });
      else return res.json({ success: "Enviado com sucesso" });
    } catch (e) {
      console.log(e);
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Envio, ${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new SendMailController();
