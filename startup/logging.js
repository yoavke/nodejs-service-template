const config = require('config');
const httpContext = require('express-http-context');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label } = format;
require('winston-daily-rotate-file');

//Find the drive the service is running on (E.G C:\)
const drive = path.parse(process.cwd()).root;

//Format of the log
const myFormat = format.printf(({ level, message, label, timestamp }) => {
    const reqId = httpContext.get('reqId') || '...';    //UID of the request
    return `${timestamp.slice(0, 19)} [${label}][${level.toUpperCase()}][${reqId.split('-')[0]}] ${message}`;
});

let environment;
switch (process.env.NODE_ENV) {
    case 'production':
        environment = 'Production'
        break;
    default:
        environment = 'Debugging'
}

let logger = createLogger({
    level: 'debug',
    format: combine(
        label({ label: (environment) }),
        timestamp(),
        myFormat
    ),

});

if (environment.toLocaleLowerCase() === 'debugging') {
    logger.add(new transports.Console({
        colorize: true,
        prettyPrint: true,
        level: 'debug',
        timestamp: true
    }));
    logger.add(new transports.DailyRotateFile({
        filename: 'error.log',
        dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
        level: 'error',
        prettyPrint: true,
        format: combine(
            timestamp(),
            myFormat
        ),
    }));
    logger.add(new transports.DailyRotateFile({
        filename: 'combined.log',
        dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
        prettyPrint: true,
        format: combine(
            timestamp(),
            myFormat
        ),
        level: 'debug'
    }));
}

if (environment.toLocaleLowerCase() === 'production') {
    logger.add(new transports.Console({
        colorize: true,
        prettyPrint: true,
        level: 'info',
        timestamp: true
    }));
    logger.add(new transports.DailyRotateFile({
        filename: 'error.log',
        dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
        level: 'error',
        prettyPrint: true,
        format: combine(
            timestamp(),
            myFormat
        )
    }));
    logger.add(new transports.DailyRotateFile({
        filename: 'combined.log',
        dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
        prettyPrint: true,
        format: combine(
            timestamp(),
            myFormat
        ),
    }));
}

if (environment.toLocaleLowerCase() === 'test') {
    logger.add(new transports.DailyRotateFile({
        filename: 'test.log',
        dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
        format: combine(
            timestamp(),
            myFormat
        ),
        colorize: true,
        prettyPrint: true,
        level: 'debug',
        timestamp: true
    }));
}

//exceptions (unhandled exceptions and unhnadled promises rejections) out of the Express scope.
logger.exceptions.handle(new transports.DailyRotateFile({
    filename: 'logsUnhandledExceptions.log',
    dirname: path.join(drive, config.get('logDirName'), '%DATE%'),
    format: combine(
        timestamp(),
        myFormat
    ),
    colorize: true,
    prettyPrint: true,
    timestamp: true
}));
process.on('unhandledRejection', (ex) => {
    throw ex;
})

module.exports = logger;