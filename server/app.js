var ampqlib = require('amqplib');
var env = require('dotenv').config();
var PushService = require('./src/push-service.js');
var logger = require('./src/logger.js');
var connection = ampqlib.connect(process.env.HOST);

PushService.checkQueueAndSendMessage(
    connection,
    logger.getLoggerFor('pushLogger')
);