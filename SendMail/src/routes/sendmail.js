import { Router } from 'express';
import sendMailController from '../controllers/SendMail'



const router = new Router();


router.get('/:id',  sendMailController.send);
//router.get('/',  sendMailController.index);

router.post('/', sendMailController.store);

console.log("Chegou aqui")



export default router; 