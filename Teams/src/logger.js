import { createLogger, format as _format, transports as _transports } from 'winston';
const { combine, timestamp, label, printf } = _format

const date = new Date().toISOString().slice(0, 10);


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });
  
 
const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
      ),
    transports: [
        new _transports.File({ filename: `../Logs/error/${date}.log`, level: 'error' }),
        new _transports.File({ filename: `../Logs/info/${date}.log`, level: 'info' }),
    ],
});
 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _transports.Console({
        format: _format.simple()
    }));
}
 
export default logger;