import { Router } from 'express';
import sendMailController from '../controllers/SendMail'

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get('/:id', loginRequired,  sendMailController.send);
router.get('/', loginRequired, sendMailController.index);

router.post('/', loginRequired, sendMailController.store);

export default router; 