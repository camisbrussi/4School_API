import Team from "../models/team";
import Teacher from "../models/teacher";
import Person from "../models/person";

class TeamController {
  async store(req, res) {
    try {
      const {teacher_id, name, year} = req.body;
      const status_id = process.env.TEAM_STATUS_ACTIVE;

      
      await Team.create({teacher_id, status_id, name, year});

      return res.json({success:'Registrado com sucesso'});
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const teams = await Team.findAll({
      attributes: ["id", "name", "year"],
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
    res.json(teams);
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const team = await Team.findByPk(id, {
        attributes: ["id", "name", "year"],
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
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
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

      await team.update(req.body);
      return res.json({success:'Editado com sucesso'});

    } catch (e) {
      console.log(e)
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
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
        return res.json('Team inactive');
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new TeamController();