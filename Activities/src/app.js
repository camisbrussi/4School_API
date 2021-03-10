import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config();

import "./database";

import express from "express";
import cors from 'cors';
import helmet from 'helmet'


import activityRoutes from "./routes/activity";


const whiteList = [
  'http://localhost:3000',
  'http://localhost:3001'
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
    this.app.use('/arquive/', express.static(resolve(__dirname, '..', "uploads", 'arquive')));
  }

  routes() {
    this.app.use("/activities/", activityRoutes);
  }
}

export default new App().app;
