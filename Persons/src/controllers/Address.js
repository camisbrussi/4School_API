import City from '../models/city';

class AdressController {
  async indexCity(req, res) {
    
    try {
      const cities = await City.findAll({
        attributes: ['id', 'description'],
      });

      return res.json(cities);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new AdressController();
