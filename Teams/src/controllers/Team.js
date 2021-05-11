import Team from '../models/team';
import Teacher from '../models/teacher';
import Person from '../models/person';
import PersonType from '../models/person_type';
import logger from '../logger';
import TeamHasStudent from '../models/team_has_student';
import Student from '../models/student';
import Responsible from '../models/responsible';
import {Op} from 'sequelize';

class TeamController {
    async store(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            let erros = [];

            const {teacher_id, name, year} = req.body;
            const status_id = process.env.TEAM_STATUS_ACTIVE;

            if (teacher_id == 0) {
                erros.push('Selecione um professor');
            }

            if (year.length < 4) {
                erros.push('Digite um ano válido');
            }

            if (erros.length) {
                return res.json({success: 'Erro ao registrar Responsável', erros});
            } else {
                const newTeam = await Team.create({
                    teacher_id,
                    status_id,
                    name,
                    year,
                });

                logger.info({
                    level: 'info',
                    message: `Turma ${newTeam.name} (id: ${newTeam.id} registrada com sucesso`,
                    label: `Registro - ${userlogged}@${iduserlogged}`,
                });

                return res.json({success: 'Registrado com sucesso', id: newTeam.id});
            }
        } catch (e) {
            console.log(e);
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Registro - ${userlogged}@${iduserlogged}`,
            });

            return res.json({
                success: 'Erro ao registrar turma',
                erros: e.errors.map((err) => err.message),
            });
        }
    }

    async storeStudents(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Missing ID'],
                });
            }

            const {students} = req.body;
            /*if (!students.length) {
                      return res.status(400).json({
                          errors: ["Missing Students"],
                      });
                  }*/

            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(400).json({
                    errors: ['Team does not exist'],
                });
            }

            //- Vamos criar um array com o ID dos estudantes. Vamos utiliza-lo para inativar os estudantes da turma que nao estarao nesse array
            let alunos = [];
            if (students.length) {
                await students.map((student) => {
                    alunos.push(student.id);
                });
            }

            //- Agora vamos inativar os alunos da turma que nao estao no array de alunos
            await TeamHasStudent.update(
                {
                    end_date: new Date().toISOString().slice(0, 10),
                },
                {
                    where: {
                        team_id: team.id,
                        end_date: {[Op.is]: null},
                        student_id: {[Op.notIn]: alunos},
                    },
                }
            );

            let erros = [];

            //- E agora salvamos os estudantes da turma
            for (let i = 0; i < students.length; i++) {
                let student_id = students[i].id;
                let team_id = team.id;
                let start_date = new Date().toISOString().slice(0, 10);

                //- Verifica se o aluno ja esta registrado em alguma outra turma no mesmo ano
                let turma = await TeamHasStudent.findAll({
                    where: {
                        student_id,
                        team_id: {[Op.ne]: team_id},
                        end_date: {[Op.is]: null},
                    },
                    include: [
                        {
                            model: Team,
                            as: 'team',
                            attributes: ['id', 'name'],
                            where: {year: team.year},
                        },
                    ],
                });

                if (turma && turma.length) {
                    //- O aluno ja esta registrado em outra turma no mesmo ano
                    erros.push(
                        'O aluno ' +
                        students[i].person.name +
                        ' já está registrado na turma ' +
                        turma[0].team.name
                    );
                    continue;
                }

                //- Verifica se o aluno ja esta registrado na turma
                let registro = await TeamHasStudent.findAll({
                    where: {
                        student_id,
                        team_id,
                        end_date: {[Op.is]: null},
                    },
                });

                if (!registro || registro.length <= 0) {
                    //- Ainda nao possui esse aluno nessa turma, entao registra
                    await TeamHasStudent.create({student_id, team_id, start_date});
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
                    success: 'Erro ao registrar um ou mais alunos',
                    erros,
                });
            else return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Registro - ${userlogged}@${iduserlogged}`,
            });

            return res.json({
                success: 'Erro ao adicionar alunos responsável',
                erros: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        const teams = await Team.findAll({
            attributes: ['id', 'name', 'year', 'status_id'],
            include: [
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id'],
                    include: [
                        {
                            model: Person,
                            as: 'person',
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: ['status_id', ['name', 'asc']],
        });
        res.json(teams);
    }

    async show(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ['Missing ID'],
                });
            }

            const team = await Team.findByPk(id, {
                attributes: ['id', 'name', 'year', 'status_id'],
                include: [
                    {
                        model: Teacher,
                        as: 'teacher',
                        attributes: ['id'],
                        include: [
                            {
                                model: Person,
                                as: 'person',
                                attributes: ['name'],
                            },
                        ],
                    },
                ],
                order: ['name'],
            });
            if (!team) {
                return res.status(400).json({
                    errors: ['Team does not exist'],
                });
            }
            return res.json(team);
        } catch (e) {
            logger.error({
                level: 'error',
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
            let erros = [];
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ['Missing ID'],
                });
            }

            const team = await Team.findByPk(id);

            if (!team) {
                return res.status(400).json({
                    errors: ['Team does not exist'],
                });
            }

            const {teacher_id, year} = req.body;

            if (teacher_id == 0) {
                erros.push('Selecione um professor');
            }

            if (year.length < 4) {
                erros.push('Digite um ano válido');
            }

            if (erros.length) {
                return res.json({success: 'Erro ao registrar Responsável', erros});
            } else {
                const newData = await team.update(req.body);
                logger.info({
                    level: 'info',
                    message: `Turma id: ${team.id}, nome: ${team.name} ano: ${team.year} editado com sucesso - (nome: ${newData.name} ano: ${newData.year})`,
                    label: `Edição - ${userlogged}@${iduserlogged}`,
                });

                return res.json({success: 'Editado com sucesso'});
            }
        } catch (e) {
            console.log(e)
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Edição - ${userlogged}@${iduserlogged}`,
            });

            return res.json({
                success: 'Erro ao registrar turma',
                erros: e.errors.map((err) => err.message),
            });
        }
    }

    async delete(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ['Missing ID'],
                });
            }

            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(400).json({
                    errors: ['team does not exist'],
                });
            }
            await team.update({status_id: 2});

            logger.info({
                level: 'info',
                message: `Turma inativada com sucesso id: ${team.id}, nome: ${team.name}`,
                label: `Exclusão - ${userlogged}@${iduserlogged}`,
            });

            return res.json('Team inactive');
        } catch (e) {
            logger.error({
                level: 'error',
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
                    errors: ['Missing ID'],
                });
            }

            const students = await TeamHasStudent.findAll({
                attributes: ['id'],
                where: {
                    team_id: id,
                    end_date: {[Op.is]: null},
                },
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id'],
                        include: [
                            {
                                model: Person,
                                as: 'person',
                                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                            },
                            {
                                model: Responsible,
                                as: 'responsible',
                                attributes: ['id'],
                                include: [
                                    {
                                        model: Person,
                                        as: 'person',
                                        attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!students) {
                return res.status(400).json({
                    errors: ['No students in class'],
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
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Buscar, ${iduserlogged}, ${userlogged}`,
            });

            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async filter(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            let {status_id} = req.query;

            let whereTeam = {}
            if (status_id) whereTeam.status_id = status_id;

            const teams = await Team.findAll({
                attributes: ['id', 'name', 'year', 'status_id'],
                where: whereTeam,
                include: [
                    {
                        model: Teacher,
                        as: 'teacher',
                        attributes: ['id'],
                        include: [
                            {
                                model: Person,
                                as: 'person',
                                attributes: ['name'],
                            },
                        ],
                    },
                ],
                order: ['status_id', ['name', 'asc']],
            });
            res.json(teams);
        } catch (e) {
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Buscar - ${userlogged}@${iduserlogged}`,
            });
        }
    }

    async filterStudents(req, res) {
        const {userlogged, iduserlogged} = req.headers;

        try {
            const {id} = req.params;
            let {name} = req.query;

            if (!id) {
                return res.status(400).json({
                    errors: ['ID da turma não encontrado'],
                });
            }

            let where = {type_id: 3};//- Aluno
            if (name) where.name = { [Op.substring]: name };

            const students = await TeamHasStudent.findAll({
                attributes: ['id'],
                where: {
                    team_id: id,
                    end_date: {[Op.is]: null},
                },
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id'],
                        include: [
                            {
                                model: Person,
                                as: 'person',
                                attributes: ['id', 'name', 'cpf', 'email', 'birth_date'],
                                where:where,
                                include: [
                                    {
                                        model: PersonType,
                                        as: 'type'
                                    }
                                ]
                            }
                        ],
                    },
                ],
            });

            res.json(students);
        } catch (e) {
            logger.error({
                level: 'error',
                message: e.errors.map((err) => err.message),
                label: `Buscar - ${userlogged}@${iduserlogged}`,
            });
        }
    }
}

export default new TeamController();
