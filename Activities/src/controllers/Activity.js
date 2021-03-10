import Activity from "../models/activity";
import Activity_status from "../models/activity_status"


class ActivityController {

  async index(req, res) {
    const activities = await Activity.findAll({
      attributes: ["id", "name", "start", "end", "status_id"],
      order: ["name"],
    });
    res.json(activities);
  }

  async store(req, res) {
    try {
      const activity = await Activity.create(req.body);
      return res.json(activity);
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const activity = await Activity.findByPk(id);
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

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      const activityUpdated = await activity.update(req.body);
      return res.json(activityUpdated);
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

      const activity = await Activity.findByPk(id);
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

export default new ActivityController();
