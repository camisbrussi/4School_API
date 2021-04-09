import dotenv from "dotenv";
import Logger from "../logger";

require('dotenv').config();
dotenv.config();

import Teacher from "../models/teacher";
import TeacherStatus from "../models/teacher_status";
import Person from "../models/person";
import PersonType from "../models/person_type";
import Phone from "../models/phone";

class TeacherController {
    async store(req, res) {
        try {
            const {name, cpf, email, birth_date, phones, password} = req.body;
            const type_id = process.env.TEACHER_PERSON_TYPE;
            const status_id = process.env.TEACHER_STATUS_ACTIVE;

            const person = await Person.create({type_id, name, cpf, email, birth_date});
            const person_id = person.id;
            await Teacher.create({person_id, status_id, password});

            if (phones) {
                phones.map((v, k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({person_id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Professor registrado com sucesso" });
            return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        try {
            const teachers = await Teacher.findAll({
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
                    }, {
                        model: TeacherStatus,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ],
                order: [
                    "status_id",
                    [Person, "name", "asc"]
                ]
            });

            res.json(teachers);
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

            const teacher = await Teacher.findByPk(id, {
                attributes: ["id", "status_id"],
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
                    }, {
                        model: TeacherStatus,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ]
            });
            if (!teacher) {
                return res.status(400).json({
                    errors: ["Teacher does not exist"],
                });
            }
            return res.json(teacher);
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

            const teacher = await Teacher.findByPk(id);
            if (!teacher) {
                return res.status(400).json({
                    errors: ["Teacher does not exist"]
                });
            }

            const person = await Person.findByPk(teacher.person_id);
            if (!person) {
                return res.status(400).json({
                    errors: ["Person does not exist"]
                });
            }

            const {status_id, name, cpf, email, birth_date, phones, password} = req.body;
            if (status_id) {
                await teacher.update({status_id});
            }
            if (password) {
                await teacher.update({password});
            }
            await person.update({name, cpf, email, birth_date});

            await Phone.destroy({
                where: { "person_id":person.id }
            });

            if (phones) {
                await phones.map((v,k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({"person_id":person.id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Professor editado com sucesso" });
            return res.json({success: 'Editado com sucesso'});
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const teacher = await Teacher.findByPk(id);
            if (!teacher) {
                return res.status(400).json({
                    errors: ["Teacher does not exist"],
                });
            }
            await teacher.update({status_id: process.env.TEACHER_STATUS_INACTIVE});
            Logger.info({ success: "Professor inativo" });
            return res.json('Teacher inactive');
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

export default new TeacherController();