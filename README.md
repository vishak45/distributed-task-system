# Distributed Task System

A scalable, real-time distributed task processing system built with Node.js, Python, Redis, and BullMQ. Features a React dashboard for monitoring queue metrics and worker status in real-time.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Python](https://img.shields.io/badge/Python-3.9-yellow)
![Redis](https://img.shields.io/badge/Redis-7-red)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Services](#services)
- [API Reference](#api-reference)
- [Task Types](#task-types)
- [Dashboard](#dashboard)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Features

- **Multi-language Workers**: Node.js and Python workers processing different task types
- **Real-time Monitoring**: Live dashboard showing queue metrics, job status, and worker activity
- **Multiple Queue Support**: Separate queues for different task types with independent scaling
- **File Upload Support**: Process uploaded files (CSV, JSON, XML) for transformation
- **ML-powered Spam Detection**: Email spam classification using trained scikit-learn model
- **Dataset Validation**: Automated CSV dataset validation with quality reports
- **API Integration**: Fetch data from external APIs with configurable endpoints
- **Data Transformation**: Convert between JSON, CSV, and XML formats
- **Auto-reconnection**: Socket.IO with automatic reconnection handling
- **Graceful Shutdown**: Proper cleanup of workers and connections

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Dashboard    │◄────│  Realtime       │◄────│     Redis       │
│    (React)      │     │  Server         │     │    (BullMQ)     │
│                 │     │  (Socket.IO)    │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐                              ┌───────┴────────┐
│                 │                              │                │
│   API Gateway   │─────────────────────────────►│   Job Queues   │
│   (Express)     │                              │                │
│                 │                              └───────┬────────┘
└─────────────────┘                                      │
                                            ┌────────────┼────────────┐
                                            │            │            │
                                            ▼            ▼            ▼
                                    ┌───────────┐ ┌───────────┐ ┌───────────┐
                                    │  Node.js  │ │  Python   │ │  Monitor  │
                                    │  Worker   │ │  Worker   │ │ Generator │
                                    └───────────┘ └───────────┘ └───────────┘
```

### Data Flow

1. **Task Submission**: Client sends task to API Gateway
2. **Queue Routing**: API routes task to appropriate BullMQ queue based on task type
3. **Processing**: Workers pick up jobs from their respective queues
4. **Real-time Updates**: Queue events are captured and broadcast via Socket.IO
5. **Dashboard Display**: React dashboard displays live metrics and job status

## Tech Stack

### Backend
- **Node.js 18** - API Gateway, Realtime Server, Node Worker
- **Python 3.9** - Python Worker with ML capabilities
- **Redis 7** - Message broker and queue storage
- **BullMQ** - Job queue management (Node.js & Python)
- **Express.js** - REST API framework
- **Socket.IO** - Real-time bidirectional communication

### Frontend
- **React 19** - Dashboard UI
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time updates

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Static file serving and reverse proxy

### ML/Data Processing
- **scikit-learn** - Spam detection model
- **pandas** - Dataset validation
- **joblib** - Model serialization

## Project Structure

```
distributed-task-system/
├── api-gateway/              # REST API for task submission
│   ├── server.js             # Express server entry point
│   ├── routes/routes.js      # API route handlers
│   ├── queue/queue.js        # BullMQ queue configuration
│   ├── package.json
│   └── Dockerfile
│
├── worker1/                  # Node.js worker
│   ├── worker.js             # Worker entry point
│   ├── processor.js          # Job processor
│   ├── tasks/
│   │   ├── apiFetch.js       # API integration task
│   │   └── DataTransform.js  # Data transformation task
│   ├── package.json
│   └── Dockerfile
│
├── workerPy/                 # Python worker
│   ├── worker.py             # Worker entry point (async BullMQ)
│   ├── processor.py          # Spam detection processor
│   ├── datasetValidator.py   # Dataset validation logic
│   ├── models/
│   │   ├── spam_model.pkl    # Trained spam classifier
│   │   └── vectorizer.pkl    # Text vectorizer
│   └── Dockerfile
│
├── realtime-server/          # Socket.IO server for live updates
│   ├── realtime.js           # Queue monitoring & broadcasting
│   ├── package.json
│   └── Dockerfile
│
├── dashboard/                # React frontend
│   ├── Dockerfile            # Multi-stage build with nginx
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── components/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── CreateTask.jsx
│       │   │   ├── MonitorQueue.jsx
│       │   │   ├── MonitorWorkers.jsx
│       │   │   └── CompletedTasks.jsx
│       │   └── hooks/
│       │       └── useSocket.js
│       ├── package.json
│       └── vite.config.js
│
├── monitor-generator/        # Auto task generator for testing
│   ├── taskAdder.js
│   ├── spam-mails.json
│   ├── package.json
│   └── Dockerfile
│
├── load-balancer/            # Nginx load balancer (optional)
│   ├── nginx.conf
│   └── Dockerfile
│
└── docker-compose.yml        # Container orchestration
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd distributed-task-system
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Dashboard**: http://localhost:8080
   - **API Gateway**: http://localhost:3000
   - **Realtime Server**: http://localhost:3001

### Stopping Services

```bash
docker-compose down
```

### Rebuilding a Specific Service

```bash
docker-compose up --build <service-name>
# e.g., docker-compose up --build worker-py
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| `redis` | 6379 | Message broker and queue storage |
| `api` | 3000 | REST API for task submission |
| `worker` | - | Node.js worker (api-integration, data-transformation) |
| `worker-py` | - | Python worker (email-spam, dataset-validator) |
| `realtime` | 3001 | Socket.IO server for live updates |
| `dashboard` | 8080 | React frontend with nginx |
| `monitor-generator` | - | Auto-generates test tasks every 10 minutes |

## API Reference

### Submit a Task

```http
POST /api/addTasks
Content-Type: multipart/form-data
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | string | Yes | Unique task identifier |
| `taskName` | string | Yes | Human-readable task name |
| `description` | string | No | Task description |
| `taskType` | string | Yes | One of: `api-integration`, `data-transformation`, `email-spam`, `dataset-validator` |
| `priority` | string | No | `low`, `medium`, `high`, `critical` |
| `timeout` | number | No | Timeout in seconds (default: 300) |
| `retryCount` | number | No | Number of retries (default: 3) |
| `textInput` | string | Conditional | Text input for email-spam tasks |
| `uploadedFile` | file | Conditional | File for data-transformation or dataset-validator |
| `outputFormat` | string | Conditional | `json`, `csv`, or `xml` for data-transformation |
| `apiEndpoint` | string | Conditional | API URL for api-integration |

#### Example: Email Spam Detection

```bash
curl -X POST http://localhost:3000/api/addTasks \
  -F "taskId=TK-001" \
  -F "taskName=Spam Check" \
  -F "taskType=email-spam" \
  -F "textInput=Congratulations! You've won a million dollars!"
```

#### Example: API Integration

```bash
curl -X POST http://localhost:3000/api/addTasks \
  -F "taskId=TK-002" \
  -F "taskName=Fetch Jokes" \
  -F "taskType=api-integration" \
  -F "apiEndpoint=https://official-joke-api.appspot.com/random_joke"
```

#### Response

```json
{
  "message": "Task submitted",
  "taskId": "TK-001",
  "queueName": "email-spam"
}
```

### Health Check

```http
GET /health
```

### Get Metrics

```http
GET /metrics
```

## Task Types

### 1. Email Spam Detection (`email-spam`)
**Worker**: Python

Classifies email text as spam or legitimate using a trained ML model.

**Input**: `textInput` - Email content to analyze

**Output**:
```json
{
  "result": 1,
  "confidence": 0.95,
  "text": "..."
}
```

### 2. Dataset Validator (`dataset-validator`)
**Worker**: Python

Validates CSV datasets for null values, duplicates, data types, and generates quality reports.

**Input**: `uploadedFile` - CSV file

**Output**:
```json
{
  "status": "success",
  "summary": {
    "total_rows": 1000,
    "total_columns": 5
  },
  "validation_results": {
    "null_values": {},
    "duplicate_rows": 0,
    "data_quality": {}
  },
  "issues_found": 0
}
```

### 3. API Integration (`api-integration`)
**Worker**: Node.js

Fetches data from external APIs.

**Input**: `apiEndpoint` - API URL to fetch

**Output**:
```json
{
  "status": "completed",
  "apiEndpoint": "https://...",
  "statusCode": 200,
  "recordsFetched": 1,
  "data": [...]
}
```

### 4. Data Transformation (`data-transformation`)
**Worker**: Node.js

Converts data between JSON, CSV, and XML formats.

**Input**: 
- `uploadedFile` or `textInput` - Source data
- `outputFormat` - Target format (`json`, `csv`, `xml`)

**Output**:
```json
{
  "status": "completed",
  "inputFormat": "csv",
  "outputFormat": "json",
  "data": "..."
}
```

## Dashboard

The React dashboard provides real-time monitoring with four main sections:

### Monitor Workers
- View all active workers
- Queue metrics per queue (waiting, active, completed, failed, delayed)
- Worker status cards

### Create Task
- Form to submit new tasks
- Task type selection with dynamic form fields
- Pre-configured API endpoints for testing

### Monitor Queue
- Live job feed (added, started, completed, failed)
- Filter by status
- Queue statistics

### Completed Tasks
- History of completed jobs
- View job results
- Per-queue completion counts

## Configuration

### Environment Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `PORT` | realtime | 3001 | Realtime server port |
| `REDIS_HOST` | all | redis | Redis hostname |
| `REDIS_PORT` | all | 6379 | Redis port |

### Scaling Workers

To scale workers horizontally:

```bash
docker-compose up --scale worker=3 --scale worker-py=2
```

## Development

### Local Development (without Docker)

1. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7
   ```

2. **Start API Gateway**
   ```bash
   cd api-gateway
   npm install
   npm start
   ```

3. **Start Node Worker**
   ```bash
   cd worker1
   npm install
   node worker.js
   ```

4. **Start Python Worker**
   ```bash
   cd workerPy
   pip install pandas redis bullmq joblib scikit-learn
   python worker.py
   ```

5. **Start Realtime Server**
   ```bash
   cd realtime-server
   npm install
   npm start
   ```

6. **Start Dashboard**
   ```bash
   cd dashboard/frontend
   npm install
   npm run dev
   ```

### Running Tests

```bash
# In each service directory
npm test
```

## Troubleshooting

### Common Issues

**Redis connection refused**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
Ensure Redis is running and accessible.

**Python worker not processing jobs**
- Check that the ML models exist in `workerPy/models/`
- Verify scikit-learn is installed

**Dashboard not showing real-time data**
- Check browser console for Socket.IO connection errors
- Verify realtime server is running on port 3001
- Check nginx proxy configuration in dashboard Dockerfile

**Job stuck in waiting state**
- Verify the correct worker is running for that queue
- Check worker logs: `docker-compose logs worker`

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f worker-py

# Last 100 lines
docker-compose logs --tail=100 api
```

### Checking Queue Status

Access Redis CLI:
```bash
docker-compose exec redis redis-cli
> KEYS bull:*
> LLEN bull:email-spam:wait
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
