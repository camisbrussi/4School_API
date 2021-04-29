"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _team = require('../models/team'); var _team2 = _interopRequireDefault(_team);
var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);
var _team_has_student = require('../models/team_has_student'); var _team_has_student2 = _interopRequireDefault(_team_has_student);
var _student = require('../models/student'); var _student2 = _interopRequireDefault(_student);
var _responsible = require('../models/responsible'); var _responsible2 = _interopRequireDefault(_responsible);
var _sequelize = require('sequelize');

class TeamController {
    async store(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {teacher_id, name, year} = req.body;
            const status_id = process.env.TEAM_STATUS_ACTIVE;
            const newTeam = await _team2.default.create({teacher_id, status_id, name, year});

            _logger2.default.info({
                level: "info",
                message: `Turma ${newTeam.name} (id: ${newTeam.id} registrada com sucesso`,
               label: `Registro - ${userlogged}@${iduserlogged}`,
            });

            return res.json({success: 'Registrado com sucesso', id: newTeam.id});
        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
               label: `Registro - ${userlogged}@${iduserlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async storeStudents(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const {students} = req.body;
            /*if (!students.length) {
                return res.status(400).json({
                    errors: ["Missing Students"],
                });
            }*/

            const team = await _team2.default.findByPk(id);
            if (!team) {
                return res.status(400).json({
                    errors: ["Team does not exist"],
                });
            }

            //- Vamos criar um array com o ID dos estudantes. Vamos utiliza-lo para inativar os estudantes da turma que nao estarao nesse array
            let alunos = [];
            if (students.length) {
                await students.map(student => {
                    alunos.push(student.id);
                });
            }


            //- Agora vamos inativar os alunos da turma que nao estao no array de alunos
            await _team_has_student2.default.update({
                end_date: new Date().toISOString().slice(0, 10)
            },{
                where: {
                    team_id: team.id,
                    end_date: { [_sequelize.Op.is]: null },
                    student_id: { [_sequelize.Op.notIn]: alunos }
                }
            });

            let erros = [];

            //- E agora salvamos os estudantes da turma
            for (let i = 0; i < students.length; i++) {
                let student_id = students[i].id;
                let team_id = team.id;
                let start_date = new Date().toISOString().slice(0, 10);

                //- Verifica se o aluno ja esta registrado em alguma outra turma no mesmo ano
                let turma = await _team_has_student2.default.findAll({
                    where: {
                        student_id,
                        team_id: {[_sequelize.Op.ne]: team_id},
                        end_date: { [_sequelize.Op.is]: null }
                    },
                    include: [
                        {
                            model: _team2.default,
                            as: 'team',
                            attributes:["id","name"],
                            where: {year: team.year}
                        }
                    ]
                });

                if (turma && turma.length) { //- O aluno ja esta registrado em outra turma no mesmo ano
                    erros.push("O aluno "+students[i].person.name+" já está registrado na turma "+turma[0].team.name);
                    continue;
                }

                //- Verifica se o aluno ja esta registrado na turma
                let registro = await _team_has_student2.default.findAll({
                    where: {
                        student_id,
                        team_id,
                        end_date: { [_sequelize.Op.is]: null }
                    }
                });

                if (!registro || registro.length <= 0) { //- Ainda nao possui esse aluno nessa turma, entao registra
                    await _team_has_student2.default.create({student_id, team_id, start_date});
                }
            }

            //- Acho que nao precisa salvar esse tipo de log
            /*logger.info({
                level: "info",
                message: `Turma id: ${newTeam.id} nome: ${newTeam.name} registrada com sucesso`,
                label: `Registrar, ${iduserlogged}, ${userlogged}`,
            });*/

            if (erros.length)
                return res.json({success: 'Erro ao registrar um ou mais alunos', erros});
            else
                return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
                label: `Registro - ${userlogged}@${iduserlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        const teams = await _team2.default.findAll({
            attributes: ["id", "name", "year", "status_id"],
            include: [
                {
                    model: _teacher2.default,
                    as: "teacher",
                    attributes: ["id"],
                    include: [
                        {
                            model: _person2.default,
                            as: "person",
                            attributes: ["name"]
                        }]
                }],
            order: [
                "status_id",
                ["name", "asc"]
            ]
        });
        res.json(teams);
    }

    async show(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const team = await _team2.default.findByPk(id, {
                attributes: ["id", "name", "year", "status_id"],
                include: [
                    {
                        model: _teacher2.default,
                        as: "teacher",
                        attributes: ["id"],
                        include: [
                            {
                                model: _person2.default,
                                as: "person",
                                attributes: ["name"]
                            }]
                    }],
                order: ["name"]
            });
            if (!team) {
                return res.status(400).json({
                    errors: ["Team does not exist"],
                });
            }
            return res.json(team);
        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
                label: `Busca - ${userlogged}@${iduserlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async update(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const team = await _team2.default.findByPk(id);
            if (!team) {
                return res.status(400).json({
                    errors: ["Team does not exist"],
                });
            }

            const newData = await team.update(req.body);

            _logger2.default.info({
                level: "info",
                message: `Turma id: ${team.id}, nome: ${team.name} ano: ${team.year} editado com sucesso - (nome: ${newData.name} ano: ${newData.year})`,
                label: `Edição - ${userlogged}@${iduserlogged}`,
            });

            return res.json({success: 'Editado com sucesso'});

        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
                label: `Edição - ${userlogged}@${iduserlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async delete(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const team = await _team2.default.findByPk(id);
            if (!team) {
                return res.status(400).json({
                    errors: ["team does not exist"],
                });
            }
            await team.update({status_id: 2});

            _logger2.default.info({
                level: "info",
                message: `Turma inativada com sucesso id: ${team.id}, nome: ${team.name}`,
                label: `Exclusão - ${userlogged}@${iduserlogged}`,
            });

            return res.json('Team inactive');
        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
                label: `Exclusão - ${userlogged}@${iduserlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async getStudents(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const students = await _team_has_student2.default.findAll({
                attributes: ["id"],
                where: {
                    team_id: id,
                    end_date: {[_sequelize.Op.is]: null}
                },
                include: [
                    {
                        model: _student2.default,
                        as: "student",
                        attributes: ["id"],
                        include: [
                            {
                                model: _person2.default,
                                as: "person",
                                attributes: ["id", "name", "cpf", "email", "birth_date"]
                            }, {
                                model: _responsible2.default,
                                as: "responsible",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: _person2.default,
                                        as: "person",
                                        attributes: ["id", "name", "cpf", "email", "birth_date"]
                                    },
                                ],
                            }
                        ]
                    }
                ]
            });

            if (!students) {
                return res.status(400).json({
                    errors: ["No students in class"],
                });
            }

            //- Vamos ajustar o array para o retorno
            let retorno = [];
            students.map((student) => {
                retorno.push(student.student);
            });

            // return res.json(students);
            return res.json(retorno);
        } catch (e) {
            _logger2.default.error({
                level: "error",
                message: e.errors.map((err) => err.message),
                label: `Buscar, ${iduserlogged}, ${userlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

exports. default = new TeamController();