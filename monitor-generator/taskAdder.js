
const { Queue } = require('bullmq');
const spamMails = require('./spam-mails.json');

const queue = new Queue('email-spam', {
  connection: {
    host: 'redis',
    port: 6379
  }
});

const generateDemoTasks = async () => {
  setInterval(async () => {
    // Select random email from spam-mails.json
    const randomMail = spamMails[Math.floor(Math.random() * spamMails.length)];
    const taskId = `TK-${Date.now()}`;
    
    try {
      const task = {
        id: taskId,
        type: 'email-spam',
        payload: {
          taskName: 'Auto Spam Detection',
          description: 'Automated spam detection task',
          priority: 'medium',
          timeout: 300,
          retryCount: 3
        },
        data: {
          textInput: randomMail,
          uploadedFile: null,
          outputFormat: null,
          apiName: null
        }
      };
      
      const job = await queue.add('email-spam', task);
      console.log(`[Monitor] Generated test task - Job ID: ${job.id}`);
      console.log(`[Monitor] Email: "${randomMail.substring(0, 50)}..."`);
    } catch (err) {
      console.error('[Monitor] Error adding task:', err.message);
    }
  }, // 10 * 60 * 1000
  10 * 60 * 1000); // Every 10 minutes
};

// Start the generator
generateDemoTasks();
console.log('[Monitor Generator] Started - adding tasks every 10 seconds...');