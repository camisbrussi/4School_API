"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

require('dotenv').config();
_dotenv2.default.config();

var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _teacher_status = require('../models/teacher_status'); var _teacher_status2 = _interopRequireDefault(_teacher_status);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _person_type = require('../models/person_type'); var _person_type2 = _interopRequireDefault(_person_type);
var _phone = require('../models/phone'); var _phone2 = _interopRequireDefault(_phone);

class TeacherController {
    async store(req, res) {
        try {
            const {name, cpf, email, birth_date, phones, password} = req.body;
            const type_id = process.env.TEACHER_PERSON_TYPE;
            const status_id = process.env.TEACHER_STATUS_ACTIVE;

            const person = await _person2.default.create({type_id, name, cpf, email, birth_date});
            const person_id = person.id;
            await _teacher2.default.create({person_id, status_id, password});

            if (phones) {
                phones.map((v, k) => {
                    let {number, is_whatsapp} = v;
                    _phone2.default.create({person_id, number, is_whatsapp});
                });
            }
            _logger2.default.info({ success: "Professor registrado com sucesso" });
            return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            _logger2.default.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        try {
            const teachers = await _teacher2.default.findAll({
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
                    }, {
                        model: _teacher_status2.default,
                        as: "status",
                        attributes: ["id", "description"]
                    }
                ],
                order: [
                    "status_id",
                    [_person2.default, "name", "asc"]
                ]
            });

            res.json(teachers);
        } catch (e) {
            _logger2.default.error(e.errors.map((err) => err.message));
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

            const teacher = await _teacher2.default.findByPk(id, {
                attributes: ["id", "status_id"],
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
                            },{
                                model: _phone2.default,
                                as: "phones",
                                attributes: ["id", "number", "is_whatsapp"]
                            }
                        ]
                    }, {
                        model: _teacher_status2.default,
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
            _logger2.default.error(e.errors.map((err) => err.message));
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

            const teacher = await _teacher2.default.findByPk(id);
            if (!teacher) {
                return res.status(400).json({
                    errors: ["Teacher does not exist"]
                });
            }

            const person = await _person2.default.findByPk(teacher.person_id);
            if (!person) {
                return res.status(400).json({
                    errors: ["Person does not exist"]
                });
            }

            let {status_id, name, cpf, email, birth_date, phones, password, isActive} = req.body;

            if (isActive !== undefined)
                status_id = isActive === true ? process.env.TEACHER_STATUS_ACTIVE : process.env.TEACHER_STATUS_INACTIVE;
            if (status_id)
                await teacher.update({status_id});

            if (password) {
                await teacher.update({password});
            }
            await person.update({name, cpf, email, birth_date});

            await _phone2.default.destroy({
                where: { "person_id":person.id }
            });

            if (phones) {
                await phones.map((v,k) => {
                    let {number, is_whatsapp} = v;
                    _phone2.default.create({"person_id":person.id, number, is_whatsapp});
                });
            }
            _logger2.default.info({ success: "Professor editado com sucesso" });
            return res.json({success: 'Editado com sucesso'});
        } catch (e) {
            _logger2.default.error(e.errors.map((err) => err.message));
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

            const teacher = await _teacher2.default.findByPk(id);
            if (!teacher) {
                return res.status(400).json({
                    errors: ["Teacher does not exist"],
                });
            }
            await teacher.update({status_id: process.env.TEACHER_STATUS_INACTIVE});
            _logger2.default.info({ success: "Professor inativo" });
            return res.json('Teacher inactive');
        } catch (e) {
            _logger2.default.error(e.errors.map((err) => err.message));
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

exports. default = new TeacherController();