import Nodemailer from "nodemailer";
require("dotenv").config();

export const sender = Nodemailer.createTransport({
  type: "Email",
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  ssl: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls : { 
    cifras : 'SSLv3' 
} 
});

/*{
        "type": "Email",
        "host": "smtp.gmail.com",
        "port": "25",
        "ssl": true,
        "username": "bigadel@gmail.com",
        "password": "XXXX",
        "defaultFromAddress": "new-mission@domain.com",
        "internalOnly": false,
        "productionOnly": false
    }*/
