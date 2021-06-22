import Message from '../models/chat_message';
import Connection from '../models/chat_connection';

class MessagesController {
  async create(req, res) {
    try {
      const { user_id, text, person_id } = req.body;

      const message = await Message.create({
        user_id,
        text,
        person_id,
      });
      
      return res.json(message);
    } catch (e) {
      console.log(e);
    }
  }

  async showByUser(req, res) {
    const { id } = req.params;

    const list = await Message.findByPk(id);

    return res.json(list);
  }
}

export default new MessagesController();
