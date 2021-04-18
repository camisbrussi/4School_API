"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _activity = require('../models/activity'); var _activity2 = _interopRequireDefault(_activity);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

class ActivityController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const {
        name,
        description,
        start,
        end,
        generate_certificate,
        vacancies,
      } = req.body;
      
      const status_id = 1;

      const newActivity = await _activity2.default.create({
        name,
        description,
        start,
        end,
        generate_certificate,
        vacancies,
        status_id,
      });
      
      _logger2.default.info({
        level: "info",
        message: `Atividade id: ${newActivity.id} login: ${newActivity.name} registrada com sucesso`,
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Atividade Registrada com sucesso" });
    } catch (e) {

      _logger2.default.error({
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
    const activities = await _activity2.default.findAll({
      attributes: ["id", "name", "start", "end", "status_id"],
      order: ["status_id", ["start", "desc"], ["name", "asc"]],
    });
    res.json(activities);
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

      const activity = await _activity2.default.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      return res.json(activity);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `${iduserlogged}, ${userlogged}`,
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

      const activity = await _activity2.default.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      const newActivity = await activity.update(req.body);

      _logger2.default.info({
        level: "info",
        message: `Atividade id: ${activity.id}, nome: ${activity.name}, inicio ${activity.start}, fim ${activity.end}, vagas ${activity.vacancies}, certificado ${activity.generate_certificate} - (nome: ${newActivity.name}, inicio ${newActivity.start}, fim ${newActivity.end}, vagas ${newActivity.vacancies}, certificado ${newActivity.generate_certificate})`,
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });


      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      _logger2.default.error({
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

      const activity = await _activity2.default.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Atividade não existe"],
        });
      }
      await activity.update({ status_id: 2 });
      
      _logger2.default.info({
        level: "info",
        message: `Atividade inativada com sucesso ${activity.name}`,
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Atividade inativa" });
    } catch (e) {
      _logger2.default.error({
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

exports. default = new ActivityController();
