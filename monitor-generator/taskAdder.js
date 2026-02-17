
const { Queue } = require('bullmq');
const spamMails = require('./spam-mails.json');

const queue = new Queue('python-spam', {
  connection: {
    host: 'redis',
    port: 6379
  }
});

const generateDemoTasks = async () => {
  setInterval(async () => {
    // Select random email from spam-mails.json
    const randomMail = spamMails[Math.floor(Math.random() * spamMails.length)];
    
    try {
      const job = await queue.add('spam-detection', { 
        text: randomMail
      });
      console.log(`[Monitor] Generated test task - Job ID: ${job.id}`);
      console.log(`[Monitor] Email: "${randomMail.substring(0, 50)}..."`);
    } catch (err) {
      console.error('[Monitor] Error adding task:', err.message);
    }
  }, 10000); // Every 10 seconds
};

// Start the generator
generateDemoTasks();
console.log('[Monitor Generator] Started - adding tasks every 10 seconds...');