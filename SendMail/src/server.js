import app from './app';
import configurar from "./whatsapp/configurar";

const port = process.env.APP_PORT;
app.listen(port);

configurar(process.env.WHATSAPP_NUMBER);