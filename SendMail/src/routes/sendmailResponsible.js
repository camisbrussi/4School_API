import { Router } from 'express';
import sendMailResponsible from '../controllers/SendMailResponsible'



const router = new Router();


router.get('/:id',  sendMailResponsible.send);
router.get('/',  sendMailResponsible.index);

router.post('/', sendMailResponsible.store);

console.log("Chegou aqui")



export default router; 