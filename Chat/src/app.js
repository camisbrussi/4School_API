import dotenv from "dotenv";
dotenv.config();

import "./database";

import express from "express";
import cors from 'cors';
import helmet from 'helmet'
import { createServer } from "http";
import { Server } from "socket.io";

import routes from "./routes/chat";

const whiteList = [
  'http://localhost:3000',
  'http://localhost:3005',
  'http://177.44.248.32:8080',
  'http://177.44.248.32:8081'
]

const corsOptions = {
  origin: function (origin, callback){
    if(whiteList.indexOf(origin) !== -1 || !origin){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const app = express();
const http = createServer(app); //Criando protocolo http
const io = new Server(http, {cors: { origin: '*' } }); 

io.on("connection", (socket) => {
})

io.on("connect_error", (err) => {
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
  
export { io }
export { http } 
