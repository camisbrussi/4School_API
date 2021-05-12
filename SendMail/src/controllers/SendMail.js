import Registration from "../models/Registration";
import Event from "../models/Event";
import Customer from "../models/Customer";
import RegistrationLog from "../models/Registration_log"

import {sender} from "../config/emailConfig";


class SendMailController {
  async show(req, res) {
    try {


      const registration_log = await RegistrationLog.findOne({where:{mail_send: 0}})
      
      if(!registration_log)
      return res.json(null);

      const registration = await Registration.findByPk(registration_log.registration_id);
     
      if(!registration)
      return res.status(400).json({ error: 'Inscrição não encontrada'});

      
      const customer = await Customer.findByPk(registration.customer_id);
      const event = await Event.findByPk(registration.event_id);

      var action = "";
     
    
      if(!customer)
        return res.status(400).json({ error: 'Cliente não encontrado'});
      
      if(!event)
        return res.status(400).json({ error: 'Evento não encontrado'});
      
      if(registration.status == 1){
        action = "Inscrição realizada"
      }
      if(registration.status == 0){
        action = "Inscrição cancelada"
      }
      if(registration.status == 2){
        action = "Presença registrada"
      }
      


        const mailOption = {
          from: process.env.EMAIL_SENDER,
          to: customer.email,
          subject: action,
          text: `${action} no evento: ${event.title}` ,
          };

          
          console.log(sender)
          
        sender.sendMail(mailOption, function(error, info){
            if (error) {
              return res.json({error: 'Não foi possível enviar o e-mail'});
            }         
              
          });

          await RegistrationLog.update({
            mail_send: 1
          },{ 
            where: {id : registration_log.id} 
          });
          
        

          return res.json({success:'Email enviado com sucesso'});


    } catch (e) {
      console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new SendMailController();