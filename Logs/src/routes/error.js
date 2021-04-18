import { Router } from "express";
import errorController from "../controllers/Error";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/', errorController.index);
router.get('/:data', loginRequired, errorController.show);


export default router;
