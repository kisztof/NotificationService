var winston = require('winston');

winston.loggers.add('pushLogger', {
    console: {
        colorize: true,
        label: 'push logger'
    },
    file: {
        filename: './logs/push.log'
    }
});

var loggers = {
    pushLogger: winston.loggers.get('pushLogger')
};

if (process.env.NODE_ENV !== 'dev') {
    loggers.pushLogger.remove(winston.transports.Console);
}

exports.getLoggerFor = function (loggerName) {
    if (!loggers.hasOwnProperty(loggerName)) {
        console.log('Logger for' + loggerName + ' not exist!');
        return;
    }
    return loggers[loggerName];
};