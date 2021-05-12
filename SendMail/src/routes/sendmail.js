import { Router } from 'express';
import sendMailController from '../controllers/SendMail'



const router = new Router();


router.get('/:id',  sendMailController.show); 
//router.get("/", loginRequired, sendMailController.index);



export default router; 