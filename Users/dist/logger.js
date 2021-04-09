"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _winston = require('winston');
 
const logger = _winston.createLogger.call(void 0, {
    format: _winston.format.combine(
        _winston.format.errors({ stack: true }),
        _winston.format.json()
    ),
    transports: [
        new _winston.transports.File({ filename: 'error.log', level: 'error' }),
        new _winston.transports.File({ filename: 'info.log', level: 'info' }),
    ],
});
 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _winston.transports.Console({
        format: _winston.format.simple()
    }));
}
 
exports. default = logger;