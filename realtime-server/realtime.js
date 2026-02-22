const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Redis client for monitoring
const redis = new Redis({
  host: 'redis',
  port: 6379,
});

// Queue instances to monitor
const queues = {
  nodeJs: new Queue('nodeJs', { connection: { host: 'redis', port: 6379 } }),
  python: new Queue('python', { connection: { host: 'redis', port: 6379 } }),
};

// Store active connections and metrics
const connectedClients = new Set();
const queueMetrics = {
  nodeJs: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
  python: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
};

const workerStatus = {
  active: [],
  idle: [],
};

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// REST endpoints for initial data and health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/metrics', (req, res) => {
  res.json({
    queues: queueMetrics,
    workers: workerStatus,
    timestamp: new Date().toISOString(),
  });
});

// Update queue metrics
async function updateQueueMetrics(queueName) {
  try {
    const queue = queues[queueName];
    if (!queue) return;

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    queueMetrics[queueName] = {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };

    // Broadcast to all connected clients
    io.emit('queue:metrics', {
      queue: queueName,
      metrics: queueMetrics[queueName],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating metrics for queue ${queueName}:`, error);
  }
}

// Monitor queue events
function setupQueueMonitoring(queueName, queue) {
  // Job added event
  queue.on('waiting', (job) => {
    console.log(`[${queueName}] Job added:`, job.id);
    io.emit('queue:job-added', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        timestamp: new Date().toISOString(),
      },
    });
    updateQueueMetrics(queueName);
  });

  // Job started/active event
  queue.on('active', (job) => {
    console.log(`[${queueName}] Job started:`, job.id);
    io.emit('queue:job-started', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        timestamp: new Date().toISOString(),
      },
    });
    updateQueueMetrics(queueName);
  });

  // Job completed event
  queue.on('completed', (job) => {
    console.log(`[${queueName}] Job completed:`, job.id);
    io.emit('queue:job-completed', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        returnValue: job.returnValue,
        timestamp: new Date().toISOString(),
      },
    });
    updateQueueMetrics(queueName);
  });

  // Job failed event
  queue.on('failed', (job, err) => {
    console.error(`[${queueName}] Job failed:`, job.id, err.message);
    io.emit('queue:job-failed', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
    });
    updateQueueMetrics(queueName);
  });

  // Job delayed event
  queue.on('delayed', (job) => {
    console.log(`[${queueName}] Job delayed:`, job.id);
    io.emit('queue:job-delayed', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        timestamp: new Date().toISOString(),
      },
    });
    updateQueueMetrics(queueName);
  });

  // Progress event
  queue.on('progress', (job, progress) => {
    console.log(`[${queueName}] Job progress:`, job.id, progress);
    io.emit('queue:job-progress', {
      queue: queueName,
      job: {
        id: job.id,
        name: job.name,
        progress: progress,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Queue global events
  queue.on('error', (err) => {
    console.error(`[${queueName}] Queue error:`, err);
    io.emit('queue:error', {
      queue: queueName,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  // Drain event (queue is empty)
  queue.on('drained', () => {
    console.log(`[${queueName}] Queue drained`);
    io.emit('queue:drained', {
      queue: queueName,
      timestamp: new Date().toISOString(),
    });
  });
}

// Monitor worker status via Redis pub/sub
function setupWorkerMonitoring() {
  const subscriber = new Redis({
    host: 'redis',
    port: 6379,
  });

  // Subscribe to worker status channel
  subscriber.subscribe('worker:status', (err, count) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to worker:status channel`);
    }
  });

  subscriber.on('message', (channel, message) => {
    try {
      const workerData = JSON.parse(message);
      console.log('Worker status update:', workerData);
      
      io.emit('worker:status-update', {
        workerId: workerData.id,
        status: workerData.status,
        queue: workerData.queue,
        currentJob: workerData.currentJob,
        processedJobs: workerData.processedJobs,
        failedJobs: workerData.failedJobs,
        timestamp: new Date().toISOString(),
      });

      // Update local worker status
      updateLocalWorkerStatus(workerData);
    } catch (error) {
      console.error('Error parsing worker status message:', error);
    }
  });
}

// Update local worker status tracking
function updateLocalWorkerStatus(workerData) {
  const activeIndex = workerStatus.active.findIndex(w => w.id === workerData.id);
  
  if (workerData.status === 'active' && workerData.currentJob) {
    // Worker is active with a job
    if (activeIndex === -1) {
      workerStatus.active.push(workerData);
    } else {
      workerStatus.active[activeIndex] = workerData;
    }
    // Remove from idle if present
    workerStatus.idle = workerStatus.idle.filter(w => w.id !== workerData.id);
  } else {
    // Worker is idle
    if (activeIndex !== -1) {
      workerStatus.active.splice(activeIndex, 1);
    }
    const idleIndex = workerStatus.idle.findIndex(w => w.id === workerData.id);
    if (idleIndex === -1) {
      workerStatus.idle.push(workerData);
    } else {
      workerStatus.idle[idleIndex] = workerData;
    }
  }

  // Emit updated worker summary
  io.emit('workers:status', {
    active: workerStatus.active.length,
    idle: workerStatus.idle.length,
    workers: {
      active: workerStatus.active,
      idle: workerStatus.idle,
    },
    timestamp: new Date().toISOString(),
  });
}

// Periodic metrics update (every 5 seconds)
setInterval(async () => {
  await updateQueueMetrics('nodeJs');
  await updateQueueMetrics('python');
}, 5000);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  connectedClients.add(socket.id);

  // Send initial metrics to the new client
  socket.emit('initial:metrics', {
    queues: queueMetrics,
    workers: {
      active: workerStatus.active.length,
      idle: workerStatus.idle.length,
      workers: workerStatus,
    },
    timestamp: new Date().toISOString(),
  });

  // Handle custom events from clients
  socket.on('request:metrics', (callback) => {
    callback({
      queues: queueMetrics,
      workers: {
        active: workerStatus.active.length,
        idle: workerStatus.idle.length,
        workers: workerStatus,
      },
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('request:queue-details', async (queueName, callback) => {
    try {
      const queue = queues[queueName];
      if (!queue) {
        callback({ error: 'Queue not found' });
        return;
      }

      const jobs = await queue.getJobs(['waiting', 'active', 'completed', 'failed']);
      callback({
        queue: queueName,
        jobs: jobs.map(job => ({
          id: job.id,
          name: job.name,
          state: job._state,
          progress: job.progress,
          data: job.data,
        })),
      });
    } catch (error) {
      callback({ error: error.message });
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
  });

  // Error handler
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Initialize monitoring
async function initialize() {
  try {
    console.log('Initializing realtime server...');

    // Setup queue monitoring
    setupQueueMonitoring('nodeJs', queues.nodeJs);
    setupQueueMonitoring('python', queues.python);

    // Setup worker monitoring
    setupWorkerMonitoring();

    // Initial metrics update
    await updateQueueMetrics('nodeJs');
    await updateQueueMetrics('python');

    console.log('Realtime server initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await redis.disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await redis.disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`Realtime server running on port ${PORT}`);
  await initialize();
});
