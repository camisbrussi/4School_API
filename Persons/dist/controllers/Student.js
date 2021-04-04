"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

require('dotenv').config();
_dotenv2.default.config();

var _student = require('../models/student'); var _student2 = _interopRequireDefault(_student);
var _student_status = require('../models/student_status'); var _student_status2 = _interopRequireDefault(_student_status);
var _responsible = require('../models/responsible'); var _responsible2 = _interopRequireDefault(_responsible);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _person_type = require('../models/person_type'); var _person_type2 = _interopRequireDefault(_person_type);
var _phone = require('../models/phone'); var _phone2 = _interopRequireDefault(_phone);

class StudentController {
    async store(req, res) {
        try {
            const {responsible_id, name, cpf, email, birth_date, phones} = req.body;
            const type_id = process.env.STUDENT_PERSON_TYPE;
            const status_id = process.env.STUDENT_STATUS_ACTIVE;

            const person = await _person2.default.create({type_id, name, cpf, email, birth_date});
            const person_id = person.id;
            await _student2.default.create({person_id, responsible_id,status_id});

            if (phones) {
                phones.map((v, k) => {
                    let {number, is_whatsapp} = v;
                    _phone2.default.create({person_id, number, is_whatsapp});
                });
            }

            return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        try {
            const students = await _student2.default.findAll({
                attributes: ["id"],
                include: [
                    {
                        model: _person2.default,
                        as: "person",
                        attributes: ["id", "name", "cpf", "email", "birth_date"],
                        include: [
                            {
                                model: _person_type2.default,
                                as: "type",
                                attributes: ["id", "description"]
                            }, {
                                model: _phone2.default,
                                as: "phones",
                                attributes: ["id", "number", "is_whatsapp"]
                            }
                        ]
                    },{
                        model: _responsible2.default,
                        as: "responsible",
                        attributes: ["id"],
                        include: [
                            {
                                model: _person2.default,
                                as: "person",
                                attributes: ["id", "name", "cpf", "email", "birth_date"],
                                include: [
                                    {
                                        model: _person_type2.default,
                                        as: "type",
                                        attributes: ["id", "description"]
                                    }, {
                                        model: _phone2.default,
                                        as: "phones",
                                        attributes: ["id", "number", "is_whatsapp"]
                                    }
                                ]
                            }
                        ]
                    },{
                        model: _student_status2.default,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ],
                order: [
                    "status_id",
                    [_person2.default, "name", "asc"]
                ]
            });

            res.json(students);
        } catch (e) {
            console.log(e);
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

            const student = await _student2.default.findByPk(id, {
                attributes: ["id"],
                include: [
                    {
                        model: _person2.default,
                        as: "person",
                        attributes: ["id", "name", "cpf", "email", "birth_date"],
                        include: [
                            {
                                model: _person_type2.default,
                                as: "type",
                                attributes: ["id", "description"]
                            }, {
                                model: _phone2.default,
                                as: "phones",
                                attributes: ["id", "number", "is_whatsapp"]
                            }
                        ]
                    },{
                        model: _responsible2.default,
                        as: "responsible",
                        attributes: ["id"],
                        include: [
                            {
                                model: _person2.default,
                                as: "person",
                                attributes: ["id", "name", "cpf", "email", "birth_date"],
                                include: [
                                    {
                                        model: _person_type2.default,
                                        as: "type",
                                        attributes: ["id", "description"]
                                    }, {
                                        model: _phone2.default,
                                        as: "phones",
                                        attributes: ["id", "number", "is_whatsapp"]
                                    }
                                ]
                            }
                        ]
                    },{
                        model: _student_status2.default,
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
            console.log(e);
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

            const student = await _student2.default.findByPk(id);
            if (!student) {
                return res.status(400).json({
                    errors: ["Student does not exist"]
                });
            }

            const person = await _person2.default.findByPk(student.person_id);
            if (!person) {
                return res.status(400).json({
                    errors: ["Person does not exist"]
                });
            }

            const {status_id, name, cpf, email, birth_date, phones} = req.body;
            await person.update({name, cpf, email, birth_date});

            if (status_id) {
                await student.update({status_id});
            }

            await _phone2.default.destroy({
                where: { "person_id":person.id }
            });

            if (phones) {
                await phones.map((v,k) => {
                    let {number, is_whatsapp} = v;
                    _phone2.default.create({"person_id":person.id, number, is_whatsapp});
                });
            }

            return res.json({success: 'Editado com sucesso'});
        } catch (e) {
            console.log(e)
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

            const student = await _student2.default.findByPk(id);
            if (!student) {
                return res.status(400).json({
                    errors: ["Student does not exist"],
                });
            }
            await student.update({status_id: process.env.STUDENT_STATUS_INACTIVE});
            return res.json('Student inactive');
        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

exports. default = new StudentController();