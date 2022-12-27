const winston = require('winston');


const rootLogger = winston.createLogger({
    level: 'info',    // Log only if info.level is less than or equal to this level
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
})

request_id = "1564"
// All the logs of the request logger will inherit the same configuration of the parent
requestLogger = rootLogger.child({ request_id: request_id })

requestLogger.log({
    level: 'info',
    message: 'Hello distributed log files!',
});

requestLogger.log({
    level: 'debug',
    message: "This is a debug"
})