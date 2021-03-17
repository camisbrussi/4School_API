"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path');
_dotenv2.default.config();

require('./database');

var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _helmet = require('helmet'); var _helmet2 = _interopRequireDefault(_helmet);


var _activity = require('./routes/activity'); var _activity2 = _interopRequireDefault(_activity);


const whiteList = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://4school.netlify.app'
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
    this.app = _express2.default.call(void 0, );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(_cors2.default.call(void 0, corsOptions));
    this.app.use(_helmet2.default.call(void 0, ));
    this.app.use(_express2.default.urlencoded({ extended: true }));
    this.app.use(_express2.default.json());
    this.app.use('/arquive/', _express2.default.static(_path.resolve.call(void 0, __dirname, '..', "uploads", 'arquive')));
  }

  routes() {
    this.app.use("/activities/", _activity2.default);
  }
}

exports. default = new App().app;
