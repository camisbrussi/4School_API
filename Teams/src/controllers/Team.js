import Team from "../models/team";
import Teacher from "../models/teacher";
import Person from "../models/person";
import logger from "../logger";

class TeamController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const {teacher_id, name, year} = req.body;
      const status_id = process.env.TEAM_STATUS_ACTIVE;

      
      const newTeam = await Team.create({teacher_id, status_id, name, year});

      logger.info({
        level: "info",
        message: `Turma id: ${newTeam.id} nome: ${newTeam.name} registrada com sucesso`,
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({success:'Registrado com sucesso'});
    } catch (e) {
      
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    const teams = await Team.findAll({
      attributes: ["id", "name", "year", "status_id"],
      include: [
        {
            model: Teacher,
            as: "teacher",
            attributes: ["id"],
            include: [
              {
                  model: Person,
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
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const team = await Team.findByPk(id, {
        attributes: ["id", "name", "year", "status_id"],
        include: [
        {
            model: Teacher,
            as: "teacher",
            attributes: ["id"],
            include: [
              {
                  model: Person,
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
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Buscar, ${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const team = await Team.findByPk(id);
      if (!team) {
        return res.status(400).json({
          errors: ["Team does not exist"],
        });
      }

      const newData = await team.update(req.body);

      logger.info({
        level: "info",
        message: `Turma id: ${team.id}, nome: ${team.name} ano: ${team.year} editado com sucesso - (nome: ${newData.name} ano: ${newData.year})`,
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({success:'Editado com sucesso'});

    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
        const { id } = req.params;
  
        if (!id) {
          return res.status(400).json({
            errors: ["Missing ID"],
          });
        }
  
        const team = await Team.findByPk(id);
        if (!team) {
          return res.status(400).json({
            errors: ["team does not exist"],
          });
        }
        await team.update({status_id: 2});
        
        logger.info({
          level: "info",
          message: `Turma inativada com sucesso id: ${team.id}, nome: ${team.name}`,
          label: `Deletar, ${iduserlogged}, ${userlogged}`,
        });

        return res.json('Team inactive');
    } catch (e) {

      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new TeamController();