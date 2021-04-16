"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _path = require('path');
_dotenv2.default.config();

require('./database');

var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _helmet = require('helmet'); var _helmet2 = _interopRequireDefault(_helmet);


var _person = require('./routes/person'); var _person2 = _interopRequireDefault(_person);
var _teacher = require('./routes/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _responsible = require('./routes/responsible'); var _responsible2 = _interopRequireDefault(_responsible);
var _student = require('./routes/student'); var _student2 = _interopRequireDefault(_student);


const whiteList = [
  'http://localhost:3000',
  'http://localhost:3003',
  'http://177.44.248.32:8080',
  'http://177.44.248.32:8083'
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
    this.app.use("/persons/", _person2.default);
    this.app.use("/teachers/", _teacher2.default);
    this.app.use("/responsibles/", _responsible2.default);
    this.app.use("/students/", _student2.default);
  }
}

exports. default = new App().app;