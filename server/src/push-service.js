var env = require('dotenv').config();
var http = require('http');
var server = http.createServer().listen(7000);
var io = require('socket.io').listen(server);

var QueueName = process.env.QUEUE_NAME;

exports.checkQueueAndSendMessage = function (connection, logger) {
    connection.then(function (conn) {
        logger.info(QueueName);
        logger.info('Successfully connected to rabbit');

        var channel = conn.createChannel();
        channel = channel.then(function (handler) {
            logger.info('Channel created');

            handler.assertExchange(QueueName);
            logger.info('Assert exchange');

            handler.assertQueue(QueueName);
            logger.info('Assert queue');

            handler.consume(QueueName, function (msg) {
                logger.info('Channel consume');
                if (msg !== null) {
                    var mpqMessage = JSON.parse(msg.content.toString());
                    var channel = null;

                    logger.info('Channel consume', mpqMessage);
                    if (mpqMessage.attributes.global === false) {
                        if (mpqMessage.type === 'error') {
                            mpqMessage.attributes.recipients.forEach(function (recipientHash) {
                                channel = '/user/' + recipientHash + '/notification/error';
                                io.sockets.emit(channel, mpqMessage);
                                logger.info('channel', channel);
                            });

                            handler.ack(msg);
                        }
                    }
                }
            });
        });

        return channel;
    });
};