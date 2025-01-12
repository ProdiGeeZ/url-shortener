const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

const ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (ENV === 'production' ? 'info' : 'debug');

const logFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
    ENV === 'development'
        ? winston.format.colorize()
        : winston.format.uncolorize(),
    winston.format.json()
);

const transports = [
    new winston.transports.Console({
        level: ENV === 'production' ? 'warn' : 'debug'
    })
];

if (ENV === 'production') {
    const errorRotateTransport = new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '30d',
        maxSize: '100m',
        zippedArchive: true
    });

    const combinedRotateTransport = new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        maxSize: '100m',
        zippedArchive: true
    });

    transports.push(errorRotateTransport, combinedRotateTransport);
}

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: logFormat,
    defaultMeta: {
        service: 'url-shortener',
        environment: ENV
    },
    transports,
    exceptionHandlers: transports,
    rejectionHandlers: transports,
    exitOnError: false
});

const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: ENV === 'development',
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body'],
    dynamicMeta: (req, res) => {
        const meta = {
            requestId: req.id,
            ip: req.ip,
            userId: req.user?.id, 
            responseTime: res.responseTime
        };
        if (ENV === 'production') {
            delete meta.headers?.authorization;
            delete meta.headers?.cookie;
        }
        return meta;
    },
    skip: (req) => {
        return ENV === 'production' && req.url === '/health';
    }
});

const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{err.message}}',
    expressFormat: true,
    colorize: ENV === 'development',
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body'],
    dynamicMeta: (req, res, next) => {
        const meta = {
            requestId: req.id,
            ip: req.ip,
            userId: req.user?.id
        };
        if (ENV === 'production') {
            delete meta.headers?.authorization;
            delete meta.headers?.cookie;
        }
        return meta;
    }
});

const requestId = (req, res, next) => {
    req.id = req.headers['x-request-id'] || uuidv4();
    res.setHeader('X-Request-ID', req.id);
    next();
};

module.exports = {
    logger,
    requestLogger,
    errorLogger,
    requestId
};