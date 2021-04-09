import { createLogger, format as _format, transports as _transports } from 'winston';
 
const logger = createLogger({
    format: _format.combine(
        _format.errors({ stack: true }),
        _format.json()
    ),
    transports: [
        new _transports.File({ filename: 'error.log', level: 'error' }),
        new _transports.File({ filename: 'info.log', level: 'info' }),
    ],
});
 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _transports.Console({
        format: _format.simple()
    }));
}
 
export default logger;