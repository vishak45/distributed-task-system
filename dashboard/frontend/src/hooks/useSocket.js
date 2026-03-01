import { useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.PROD ? '' : 'http://localhost:3001'

let socket = null

// Module-level state that persists across component mounts
const sharedState = {
  queueMetrics: {
    'api-integration': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'data-transformation': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'email-spam': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'dataset-validator': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
  },
  workers: { active: [], idle: [] },
  recentJobs: [],
  completedJobs: [],
}

const listeners = new Set()

function notifyListeners() {
  listeners.forEach(listener => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return sharedState
}

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
    
    // Setup listeners once when socket is created
    setupSocketListeners(socket)
  }
  return socket
}

function setupSocketListeners(socket) {
  // Initial metrics
  socket.on('initial:metrics', (data) => {
    console.log('Received initial metrics:', data)
    if (data.queues) {
      sharedState.queueMetrics = data.queues
    }
    if (data.workers?.workers) {
      sharedState.workers = data.workers.workers
    }
    notifyListeners()
  })

  // Queue metrics updates
  socket.on('queue:metrics', (data) => {
    sharedState.queueMetrics = {
      ...sharedState.queueMetrics,
      [data.queue]: data.metrics,
    }
    notifyListeners()
  })

  // Job events
  socket.on('queue:job-added', (data) => {
    const newJob = {
      id: data.job.id,
      taskName: data.job.data?.payload?.taskName || data.job.name,
      queue: data.queue,
      status: 'pending',
      priority: data.job.data?.payload?.priority || 'medium',
      createdAt: new Date(data.job.timestamp).toLocaleTimeString(),
      timestamp: data.job.timestamp,
    }
    sharedState.recentJobs = [newJob, ...sharedState.recentJobs].slice(0, 50)
    notifyListeners()
  })

  socket.on('queue:job-started', (data) => {
    sharedState.recentJobs = sharedState.recentJobs.map(job => 
      job.id === data.job.id 
        ? { ...job, status: 'processing', startedAt: data.job.timestamp }
        : job
    )
    notifyListeners()
  })

  socket.on('queue:job-completed', (data) => {
    sharedState.recentJobs = sharedState.recentJobs.map(job => 
      job.id === data.job.id 
        ? { ...job, status: 'completed', completedAt: new Date(data.job.timestamp).toLocaleTimeString() }
        : job
    )
    
    // Add to completed jobs
    const completedJob = {
      id: data.job.id,
      name: data.job.name,
      queue: data.queue,
      result: data.job.returnValue,
      completedAt: data.job.timestamp,
    }
    sharedState.completedJobs = [completedJob, ...sharedState.completedJobs].slice(0, 100)
    notifyListeners()
  })

  socket.on('queue:job-failed', (data) => {
    sharedState.recentJobs = sharedState.recentJobs.map(job => 
      job.id === data.job.id 
        ? { ...job, status: 'failed', error: data.job.error, failedAt: data.job.timestamp }
        : job
    )
    notifyListeners()
  })

  socket.on('queue:job-progress', (data) => {
    sharedState.recentJobs = sharedState.recentJobs.map(job => 
      job.id === data.job.id 
        ? { ...job, progress: data.job.progress }
        : job
    )
    notifyListeners()
  })

  // Worker status updates
  socket.on('workers:status', (data) => {
    if (data.workers) {
      sharedState.workers = data.workers
    }
    notifyListeners()
  })

  socket.on('worker:status-update', (data) => {
    console.log('Worker update:', data)
  })
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(() => {
    const s = getSocket()
    return s.connected
  })
  
  // Use useSyncExternalStore to subscribe to shared state
  const state = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    const socket = getSocket()

    const onConnect = () => {
      console.log('Connected to realtime server')
      setIsConnected(true)
    }

    const onDisconnect = () => {
      console.log('Disconnected from realtime server')
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  const requestMetrics = useCallback((callback) => {
    const socket = getSocket()
    socket.emit('request:metrics', callback)
  }, [])

  const requestQueueDetails = useCallback((queueName, callback) => {
    const socket = getSocket()
    socket.emit('request:queue-details', queueName, callback)
  }, [])

  return {
    isConnected,
    queueMetrics: state.queueMetrics,
    workers: state.workers,
    recentJobs: state.recentJobs,
    completedJobs: state.completedJobs,
    requestMetrics,
    requestQueueDetails,
  }
}
