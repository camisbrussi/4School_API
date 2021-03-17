"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _activity = require('../models/activity'); var _activity2 = _interopRequireDefault(_activity);



class ActivityController {

  async store(req, res) {
    try {
      const {name, description, start, end, generate_certificate, vacancies} = req.body;

      console.log('generate_certificate'+generate_certificate)
      
      const status_id = 1;

      await _activity2.default.create({
        name, description, start, end, generate_certificate, vacancies, status_id
      })

      return res.json({success:'Registrado com sucesso'});
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        
        errors: e.errors.map((err) => err.message),
      });
    }
  }


  
  async index(req, res) {
    const activities = await _activity2.default.findAll({
      attributes: ["id", "name", "start", "end", "status_id"],
      order: ["name"],
    });
    res.json(activities);
  }


  async show(req, res) {
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

      const activity = await _activity2.default.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      await activity.update(req.body);
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

      const activity = await _activity2.default.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }
      await activity.update({status_id: 2});
      return res.json('Activity inactive');
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new ActivityController();
