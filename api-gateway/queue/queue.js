const {Queue} = require('bullmq');

const queue = new Queue('queue', {
    connection: {
        host: 'redis',
        port: 6379
    }
});

module.exports = queue;