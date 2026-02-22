# Realtime Server Documentation

A real-time monitoring server using Socket.IO that tracks distributed task queue events, job status, and worker information.

## Features

- **Queue Monitoring**: Monitors job arrivals, start, completion, and failures across multiple queues (nodeJs, python)
- **Worker Status Tracking**: Tracks which workers are active and idle
- **Real-time Events**: Emits Socket.IO events for all queue and worker state changes
- **Metrics Dashboard**: Provides REST endpoints and Socket.IO events for periodic metrics updates
- **Job Progress**: Tracks and broadcasts job progress updates

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on port 3001 by default (configurable via `PORT` environment variable).

## Socket.IO Events

### Emitted Events (Server to Client)

#### Queue Events

**`queue:job-added`** - New job added to queue
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    data: { /* job data */ },
    timestamp: "2024-02-22T10:30:00.000Z"
  }
}
```

**`queue:job-started`** - Job started processing
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    timestamp: "2024-02-22T10:30:05.000Z"
  }
}
```

**`queue:job-completed`** - Job completed successfully
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    returnValue: { /* result */ },
    timestamp: "2024-02-22T10:30:15.000Z"
  }
}
```

**`queue:job-failed`** - Job failed
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    error: "Error message",
    timestamp: "2024-02-22T10:30:15.000Z"
  }
}
```

**`queue:job-delayed`** - Job delayed
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    timestamp: "2024-02-22T10:30:00.000Z"
  }
}
```

**`queue:job-progress`** - Job progress update
```javascript
{
  queue: "nodeJs",
  job: {
    id: "job-123",
    name: "taskName",
    progress: 75,
    timestamp: "2024-02-22T10:30:10.000Z"
  }
}
```

**`queue:metrics`** - Periodic queue metrics (every 5 seconds)
```javascript
{
  queue: "nodeJs",
  metrics: {
    waiting: 5,
    active: 2,
    completed: 120,
    failed: 3,
    delayed: 1
  },
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

**`queue:drained`** - Queue is empty
```javascript
{
  queue: "nodeJs",
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

**`queue:error`** - Queue error
```javascript
{
  queue: "nodeJs",
  error: "Error message",
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

#### Worker Events

**`worker:status-update`** - Worker status changed
```javascript
{
  workerId: "worker-1",
  status: "active",
  queue: "nodeJs",
  currentJob: "job-123",
  processedJobs: 45,
  failedJobs: 2,
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

**`workers:status`** - Overall worker status summary
```javascript
{
  active: 2,
  idle: 1,
  workers: {
    active: [
      {
        id: "worker-1",
        status: "active",
        currentJob: "job-123",
        processedJobs: 45
      }
    ],
    idle: [
      {
        id: "worker-2",
        status: "idle",
        processedJobs: 40
      }
    ]
  },
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

#### Initial Connection Events

**`initial:metrics`** - Sent when client connects
```javascript
{
  queues: {
    nodeJs: { waiting: 5, active: 2, completed: 120, failed: 3, delayed: 1 },
    python: { waiting: 0, active: 0, completed: 50, failed: 1, delayed: 0 }
  },
  workers: {
    active: 2,
    idle: 1,
    workers: { /* worker details */ }
  },
  timestamp: "2024-02-22T10:30:00.000Z"
}
```

### Received Events (Client to Server)

**`request:metrics`** - Request current metrics
```javascript
socket.emit('request:metrics', (data) => {
  console.log(data);
});
```

**`request:queue-details`** - Request detailed queue information
```javascript
socket.emit('request:queue-details', 'nodeJs', (data) => {
  console.log(data);
});
```

## REST API Endpoints

### `GET /health`
Health check endpoint.

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-02-22T10:30:00.000Z"
}
```

### `GET /metrics`
Get current metrics for all queues and workers.

Response:
```json
{
  "queues": {
    "nodeJs": { "waiting": 5, "active": 2, "completed": 120, "failed": 3, "delayed": 1 },
    "python": { "waiting": 0, "active": 0, "completed": 50, "failed": 1, "delayed": 0 }
  },
  "workers": {
    "active": ["worker-1", "worker-2"],
    "idle": ["worker-3"]
  },
  "timestamp": "2024-02-22T10:30:00.000Z"
}
```

## Client Example

```javascript
import io from 'socket.io-client';

// Connect to realtime server
const socket = io('http://localhost:3001');

// Listen for initial metrics
socket.on('initial:metrics', (data) => {
  console.log('Initial metrics:', data);
});

// Listen for job events
socket.on('queue:job-added', (data) => {
  console.log('New job:', data.job.id);
});

socket.on('queue:job-started', (data) => {
  console.log('Job started:', data.job.id);
});

socket.on('queue:job-completed', (data) => {
  console.log('Job completed:', data.job.id);
});

socket.on('queue:job-failed', (data) => {
  console.log('Job failed:', data.job.error);
});

// Listen for metrics updates
socket.on('queue:metrics', (data) => {
  console.log(`Queue ${data.queue} metrics:`, data.metrics);
});

// Listen for worker status
socket.on('workers:status', (data) => {
  console.log('Active workers:', data.active);
  console.log('Idle workers:', data.idle);
});

// Request metrics on demand
socket.emit('request:metrics', (data) => {
  console.log('Current metrics:', data);
});

// Request queue details
socket.emit('request:queue-details', 'nodeJs', (data) => {
  console.log('Queue details:', data);
});
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Architecture

The realtime server:
1. Connects to Redis where BullMQ queues are stored
2. Monitors queue events (job add, start, complete, fail, progress)
3. Uses Redis pub/sub to receive worker status updates
4. Broadcasts real-time updates to all connected Socket.IO clients
5. Maintains a cache of current queue metrics (updated every 5 seconds)
6. Provides REST endpoints for health checks and metrics

## Monitored Queues

- **nodeJs** - Node.js task queue
- **python** - Python task queue

## Connection Requirements

- Redis instance running and accessible
- Clients must connect via Socket.IO with CORS enabled
