import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
import helmet from 'helmet'

import errorRoutes from "./routes/error";
import infoRoutes from "./routes/info";

const whiteList = [
  'http://localhost:3000',
  'http://localhost:3010',
  'http://177.44.248.32:8080',
  'http://177.44.248.32:8090'
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

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/error/", errorRoutes);
    this.app.use("/infos/", infoRoutes);
  }
}

export default new App().app;
