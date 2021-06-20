import { http } from "./app";
import "./websocket/client"
import "./websocket/admin"

http.listen( process.env.APP_PORT );
