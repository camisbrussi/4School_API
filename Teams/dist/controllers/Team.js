"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _team = require('../models/team'); var _team2 = _interopRequireDefault(_team);
var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);

class TeamController {
  async store(req, res) {
    try {
      const {teacher_id, name, year} = req.body;
      const status_id = process.env.TEAM_STATUS_ACTIVE;

      
      await _team2.default.create({teacher_id, status_id, name, year});

      return res.json({success:'Registrado com sucesso'});
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
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
    try {
      const { id } = req.params;
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

      const team = await _team2.default.findByPk(id);
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
  
        const team = await _team2.default.findByPk(id);
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

exports. default = new TeamController();