const {Queue} = require('bullmq');

const connection = {
    host: 'redis',
    port: 6379
};

// Create separate queues for each task type
const queues = {
    'api-integration': new Queue('api-integration', { connection }),
    'data-transformation': new Queue('data-transformation', { connection }),
    'email-spam': new Queue('email-spam', { connection }),
    'dataset-validator': new Queue('dataset-validator', { connection })
};

module.exports = {
    getQueue: (queueName) => queues[queueName],
    queues
};