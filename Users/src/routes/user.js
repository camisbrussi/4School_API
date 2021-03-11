import { Router } from "express";
import userController from "../controllers/User";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/', userController.index); //Lista usuários
router.get('/:id', userController.show); //Lista um usuário

router.post('/', userController.store);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
