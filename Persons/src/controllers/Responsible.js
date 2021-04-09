import dotenv from "dotenv";
import Logger from "../logger";

require('dotenv').config();
dotenv.config();

import Responsible from "../models/responsible";
import Person from "../models/person";
import PersonType from "../models/person_type";
import Phone from "../models/phone";
import Student from "./Student";

class ResponsibleController {
    async store(req, res) {
        try {
            const {name, cpf, email, birth_date, phones, password} = req.body;
            const type_id = process.env.RESPONSIBLE_PERSON_TYPE;

            const person = await Person.create({type_id, name, cpf, email, birth_date});
            const person_id = person.id;
            const responsible = await Responsible.create({person_id, password},{logging: console.log});

            if (phones) {
                phones.map((v, k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({person_id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Responsável registrado com sucesso" });
            return res.json({success: 'Registrado com sucesso', responsible_id: responsible.id});
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        try {
            const responsibles = await Responsible.findAll({
                attributes: ["id"],
                include: [
                    {
                        model: Person,
                        as: "person",
                        attributes: ["id", "name", "cpf", "email", "birth_date"],
                        include: [
                            {
                                model: PersonType,
                                as: "type",
                                attributes: ["id", "description"]
                            }, {
                                model: Phone,
                                as: "phones",
                                attributes: ["id", "number", "is_whatsapp"]
                            }
                        ]
                    }
                ],
                order: [
                    [Person, "name", "asc"]
                ]
            });

            res.json(responsibles);
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
        }
    }

    async show(req, res) {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const responsible = await Responsible.findByPk(id, {
                attributes: ["id"],
                include: [
                    {
                        model: Person,
                        as: "person",
                        attributes: ["id", "name", "cpf", "email", "birth_date"],
                        include: [
                            {
                                model: PersonType,
                                as: "type",
                                attributes: ["id", "description"]
                            },{
                                model: Phone,
                                as: "phones",
                                attributes: ["id", "number", "is_whatsapp"]
                            }
                        ]
                    }
                ]
            });
            if (!responsible) {
                return res.status(400).json({
                    errors: ["Responsible does not exist"],
                });
            }
            return res.json(responsible);
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async update(req, res) {
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
                    errors: ["Responsible does not exist"]
                });
            }

            const person = await Person.findByPk(responsible.person_id);
            if (!person) {
                return res.status(400).json({
                    errors: ["Person does not exist"]
                });
            }

            const {name, cpf, email, birth_date, phones, password} = req.body;
            await person.update({name, cpf, email, birth_date});

            if (password) {
                await responsible.update({password});
            }

            await Phone.destroy({
                where: { "person_id":person.id }
            });

            if (phones) {
                await phones.map((v,k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({"person_id":person.id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Responsável editado com sucesso" });
            return res.json({success: 'Editado com sucesso'});
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
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