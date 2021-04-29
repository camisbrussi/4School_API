"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _winston = require('winston');
const { combine, timestamp, label, printf } = _winston.format

const date = new Date().toISOString().slice(0, 10);


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} | [${label}] ${level}: ${message}`;
  });
  
 
const logger = _winston.createLogger.call(void 0, {
    level: 'info',
    format: combine(
        timestamp(),
        myFormat
      ),
    transports: [
        new _winston.transports.File({ filename: `../Logs/error/${date}.log`, level: 'error' }),
        new _winston.transports.File({ filename: `../Logs/info/${date}.log`, level: 'info' }),
    ],
});
 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _winston.transports.Console({
        format: _winston.format.simple()
    }));
}
 
exports. default = logger;