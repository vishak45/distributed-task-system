import { useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.PROD ? '' : 'http://localhost:3001'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [queueMetrics, setQueueMetrics] = useState({
    'api-integration': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'data-transformation': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'email-spam': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    'dataset-validator': { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
  })
  const [workers, setWorkers] = useState({ active: [], idle: [] })
  const [recentJobs, setRecentJobs] = useState([])
  const [completedJobs, setCompletedJobs] = useState([])

  useEffect(() => {
    const socket = getSocket()

    socket.on('connect', () => {
      console.log('Connected to realtime server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from realtime server')
      setIsConnected(false)
    })

    // Initial metrics
    socket.on('initial:metrics', (data) => {
      console.log('Received initial metrics:', data)
      if (data.queues) {
        setQueueMetrics(data.queues)
      }
      if (data.workers?.workers) {
        setWorkers(data.workers.workers)
      }
    })

    // Queue metrics updates
    socket.on('queue:metrics', (data) => {
      setQueueMetrics(prev => ({
        ...prev,
        [data.queue]: data.metrics,
      }))
    })

    // Job events
    socket.on('queue:job-added', (data) => {
      setRecentJobs(prev => [{
        id: data.job.id,
        taskName: data.job.data?.payload?.taskName || data.job.name,
        queue: data.queue,
        status: 'pending',
        priority: data.job.data?.payload?.priority || 'medium',
        createdAt: new Date(data.timestamp).toLocaleTimeString(),
        timestamp: data.timestamp,
      }, ...prev].slice(0, 50))
    })

    socket.on('queue:job-started', (data) => {
      setRecentJobs(prev => prev.map(job => 
        job.id === data.job.id 
          ? { ...job, status: 'processing', startedAt: data.timestamp }
          : job
      ))
    })

    socket.on('queue:job-completed', (data) => {
      setRecentJobs(prev => prev.map(job => 
        job.id === data.job.id 
          ? { ...job, status: 'completed', completedAt: new Date(data.timestamp).toLocaleTimeString() }
          : job
      ))
      
      // Add to completed jobs
      setCompletedJobs(prev => [{
        id: data.job.id,
        name: data.job.name,
        queue: data.queue,
        result: data.job.returnValue,
        completedAt: data.timestamp,
      }, ...prev].slice(0, 100))
    })

    socket.on('queue:job-failed', (data) => {
      setRecentJobs(prev => prev.map(job => 
        job.id === data.job.id 
          ? { ...job, status: 'failed', error: data.job.error, failedAt: data.timestamp }
          : job
      ))
    })

    socket.on('queue:job-progress', (data) => {
      setRecentJobs(prev => prev.map(job => 
        job.id === data.job.id 
          ? { ...job, progress: data.job.progress }
          : job
      ))
    })

    // Worker status updates
    socket.on('workers:status', (data) => {
      if (data.workers) {
        setWorkers(data.workers)
      }
    })

    socket.on('worker:status-update', (data) => {
      // Update individual worker status
      console.log('Worker update:', data)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('initial:metrics')
      socket.off('queue:metrics')
      socket.off('queue:job-added')
      socket.off('queue:job-started')
      socket.off('queue:job-completed')
      socket.off('queue:job-failed')
      socket.off('queue:job-progress')
      socket.off('workers:status')
      socket.off('worker:status-update')
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
    queueMetrics,
    workers,
    recentJobs,
    completedJobs,
    requestMetrics,
    requestQueueDetails,
  }
}
