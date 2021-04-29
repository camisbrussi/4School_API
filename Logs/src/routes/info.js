import { Router } from "express";
import infoController from "../controllers/Info";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/', infoController.index);
router.get('/show/:arquive', infoController.show);
router.post('/filter', infoController.filterIndex);


export default router;
