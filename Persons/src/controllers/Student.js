import dotenv from "dotenv";
import Logger from "../logger";

require('dotenv').config();
dotenv.config();

import Student from "../models/student";
import StudentStatus from "../models/student_status";
import Responsible from "../models/responsible";
import Person from "../models/person";
import PersonType from "../models/person_type";
import Phone from "../models/phone";

class StudentController {
    async store(req, res) {
        try {
            const {responsible_id, name, cpf, email, birth_date, phones} = req.body;
            const type_id = process.env.STUDENT_PERSON_TYPE;
            const status_id = process.env.STUDENT_STATUS_ACTIVE;

            const person = await Person.create({type_id, name, cpf, email, birth_date});
            const person_id = person.id;
            await Student.create({person_id, responsible_id,status_id});

            if (phones) {
                phones.map((v, k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({person_id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Estudante registrado com sucesso" });
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
            const students = await Student.findAll({
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
                    },{
                        model: Responsible,
                        as: "responsible",
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
                        ]
                    },{
                        model: StudentStatus,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ],
                order: [
                    "status_id",
                    [Person, "name", "asc"]
                ]
            });

            res.json(students);
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
        }
    }

    async indexResponsible(req, res) {
        try {
            const {responsible_id} = req.params;
            if (!responsible_id) {
                return res.status(400).json({
                    errors: ["Missing Responsible ID"],
                });
            }

            const students = await Student.findAll({
                attributes: ["id"],
                where: {responsible_id},
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
                    },{
                        model: Responsible,
                        as: "responsible",
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
                        ]
                    },{
                        model: StudentStatus,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ],
                order: [
                    "status_id",
                    [Person, "name", "asc"]
                ]
            });

            res.json(students);
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

            const student = await Student.findByPk(id, {
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
                    },{
                        model: Responsible,
                        as: "responsible",
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
                        ]
                    },{
                        model: StudentStatus,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ]
            });
            if (!student) {
                return res.status(400).json({
                    errors: ["Student does not exist"],
                });
            }
            return res.json(student);
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

            const student = await Student.findByPk(id);
            if (!student) {
                return res.status(400).json({
                    errors: ["Student does not exist"]
                });
            }

            const person = await Person.findByPk(student.person_id);
            if (!person) {
                Logger.error(e.errors.map((err) => err.message));
                return res.status(400).json({
                    errors: ["Person does not exist"]
                });
            }

            let {status_id, name, cpf, email, birth_date, phones, isActive} = req.body;
            await person.update({name, cpf, email, birth_date});

            if (isActive !== undefined)
                status_id = isActive === true ? process.env.STUDENT_STATUS_ACTIVE : process.env.STUDENT_STATUS_INACTIVE;
            if (status_id)
                await student.update({status_id});

            await Phone.destroy({
                where: { "person_id":person.id }
            });

            if (phones) {
                await phones.map((v,k) => {
                    let {number, is_whatsapp} = v;
                    Phone.create({"person_id":person.id, number, is_whatsapp});
                });
            }
            Logger.info({ success: "Estudante editado com sucesso" });
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

            const student = await Student.findByPk(id);
            if (!student) {
                return res.status(400).json({
                    errors: ["Student does not exist"],
                });
            }
            await student.update({status_id: process.env.STUDENT_STATUS_INACTIVE});
            Logger.info({ success: "Estudante Inativo" });
            return res.json('Student inactive');
        } catch (e) {
            Logger.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

export default new StudentController();