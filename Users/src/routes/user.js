import { Router } from "express";
import userController from "../controllers/User";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/', loginRequired, userController.index); //Lista usuários
router.get('/:id', loginRequired, userController.show); //Lista um usuário

router.post('/', loginRequired, userController.store);
router.put('/:id', loginRequired, userController.update);
router.delete('/:id', loginRequired, userController.delete);

export default router;
