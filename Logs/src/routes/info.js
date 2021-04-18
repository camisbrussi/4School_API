import { Router } from "express";
import infoController from "../controllers/Info";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/', loginRequired, infoController.index);
router.get('/:data', loginRequired, infoController.show);


export default router;
