import dotenv from "dotenv";

require("dotenv").config();
dotenv.config();

import Message from "../models/message";
import Person from "../models/person";
import logger from "../logger";
import {sender} from "../config/emailConfig";
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
            const { Op } = require("sequelize");
            const messages = await Message.findAll({
                where : {
                    [Op.or]: [
                        {[Op.and]: [{send_email: 1},{email_sent: 0}]},
                        {[Op.and]: [{send_whatsapp: 1},{whatsapp_sent: 0}]}
                    ]
                }
            });

            if (!messages) {
                return res.status(200).json({success: "Mensagens enviadas"});
            }

            const wbm = require('wbm');
            let temErro = false;
            for (let i = 0; i < messages.length; i++) {
                let v = messages[i];
                let enviouEmail = v.email_sent;
                let enviouWhats = v.whatsapp_sent;

                if (v.send_email && !enviouEmail && v.email != null && v.email.length) {
                    //- Deve enviar um e-mail

                    const mailOption = {
                        from: process.env.EMAIL_SENDER,
                        to: v.email,
                        subject: "Mensagem da 4School",
                        text: v.message
                    };

                    await sender.sendMail(mailOption, function (error, info) {
                        if (error) {
                            temErro = true;
                            console.log(error);
                        } else {
                            //- Atualiza o registro para 'e-mail enviado'
                            v.update({
                                email_sent:true
                            });
                        }
                    });

                }

                if (v.send_whatsapp && !enviouWhats && v.number != null && v.number.length) {
                    //- Deve enviar um whats
                    //- Como muitos números ainda não estão cadastrados com o 9º dígito no whats, vamos mandar a
                    //- mensagem para o numero com 8 e 9 dígitos.

                    let numero = v.number;
                    let numero2 = numero.substr(0,2) + numero.substr(3,8);

                    await wbm.start().then(async () => {
                        const phones = ["55"+numero, "55"+numero2];
                        const message = v.message;
                        await wbm.send(phones, message);
                        await wbm.end();

                        //- Atualiza o registro para 'whatsapp enviado'
                        await v.update({
                            whatsapp_sent:true
                        });

                        enviouWhats = true;
                    }).catch(err => { console.log(err); temErro = true });
                }

            }

            // if (temErro) {
            //     return res.status(400).json({error: "Erro ao enviar uma ou mais mensagens"});
            // } else {
            return res.status(200).json({success: "Script de envio de mensagens executado!"});
            // }

            /*

            const registration_log = await Message.findOne({
                where: {email_sent: 0},
                //para whats tratar isso
            });

            if (!registration_log) return res.json(null);

            const registration = await Message.findByPk(registration_log.id);

            if (!registration)
                return res.status(400).json({error: "Mensagem não encontrada"});

            const person = await Person.findByPk(registration.person_id);

            if (!person)
                return res.status(400).json({error: "Pessoa não encontrado"});

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
                    where: {id: registration_log.id},
                },
                console.log(Message)
            );

            sender.sendMail(mailOption, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(400).json({error: "Não foi possível enviar o e-mail"});
                } else {
                    return res.status(200).json({success: "Email enviado com sucesso"});
                }
            });

            */

        } catch (e) {
            console.log(e);
            return res.json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async store(req, res) {
        const {userlogged} = req.headers;
        const userLogged = JSON.parse(userlogged);
        try {
            const {destinatarios, message, send_email, send_whatsapp} = req.body;

            let erros = [];
            if (message.length <= 0) {
                erros.push("Informe a mensagem");
            }
            if (!destinatarios.length) {
                erros.push("Informe os destinatários");
            }
            if (!send_email && !send_whatsapp) {
                erros.push("Informe se a mensagem deve ser enviada por e-mail, WhatsApp ou ambos");
            }

            if (erros.length) {
                return res.status(200).json({ erros });
            }

            //- E agora salvamos os destinatarios da mensagem
            for (let i = 0; i < destinatarios.length; i++) {
                let person_id = destinatarios[i].id;

                const person = await Person.findByPk(person_id, {
                    attributes: ['email'],
                    include: [
                        {
                            model: Phone,
                            as: 'phones',
                            attributes: ['number'],
                            where: {
                                is_whatsapp: 1
                            },
                            required: false
                        },
                    ],
                });

                if (!person) {
                    return res.status(400).json({
                        errors: ["Erro ao buscar destinatário no banco de dados"],
                    });
                }

                let email = send_email ? person.email : null;
                let number = send_whatsapp && person.phones.length ? person.phones[0].number : null;

                let enviarEmail = email == null ? false : send_email;
                let enviarWhats = number == null ? false : send_whatsapp;

                if (email != null || number != null) {
                    //- Cria a mensagem
                    await Message.create({
                        person_id,
                        email,
                        number,
                        message,
                        send_email: enviarEmail,
                        send_whatsapp: enviarWhats,
                    });
                }
            }

            return res.json({success: "Enviado com sucesso"});
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
