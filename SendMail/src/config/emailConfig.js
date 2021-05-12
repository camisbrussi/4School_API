import Nodemailer from 'nodemailer';


export const sender = Nodemailer.createTransport({
    
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth:{
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD },
    tls: { rejectUnauthorized: false },
    });