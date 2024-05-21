const winston = require('winston');
const configObj = require('../config/dotenv.config.js');
const { node_env } = configObj;

const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colours: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
};

// Logger development



const devLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levels.colours }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./devLogs.log",
            level: "error",
            format: winston.format.simple()
        })
        ]
})


//Looger production

const prodLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: levels.colours}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./prodLogs.log",
            level:"error",
            format: winston.format.simple()
        })
    ]
})

// ternario con las opciones
const logger = node_env === 'dev' ? devLogger : prodLogger;

// middleware => apartarlo paara llevarlo a  otro archivo
/*
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;

*/

module.exports = logger;