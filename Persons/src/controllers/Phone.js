import dotenv from "dotenv";

require('dotenv').config();
dotenv.config();

import Phone from "../models/phone";

class PhoneController {
    async store(req, res) {
        try {
            const {person_id, number, is_whatsapp} = req.body;
            await Phone.create({person_id, number, is_whatsapp});

            return res.json({success: 'Registrado com sucesso'});
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async index(req, res) {
        try {
            const phones = await Phone.findAll();
            res.json(phones);
        } catch (e) {
            console.log(e);
        }
    }

    async show(req, res) {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const phone = await Phone.findByPk(id);
            if (!phone) {
                return res.status(400).json({
                    errors: ["Phone does not exist"],
                });
            }
            return res.json(phone);
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async update(req, res) {
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const phone = await Phone.findByPk(id);
            if (!phone) {
                return res.status(400).json({
                    errors: ["Phone does not exist"]
                });
            }

            const {number, is_whatsapp} = req.body;
            await phone.update({number, is_whatsapp});

            return res.json({success: 'Editado com sucesso'});
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).json({
                    errors: ["Missing ID"],
                });
            }

            const phone = await Phone.findByPk(id);
            if (!phone) {
                return res.status(400).json({
                    errors: ["Phone does not exist"],
                });
            }
            await phone.destroy()
            return res.json('Phone deleted');
        } catch (e) {
            return res.status(400).json({
                errors: e.errors.map((err) => err.message),
            });
        }
    }
}

export default new PhoneController();