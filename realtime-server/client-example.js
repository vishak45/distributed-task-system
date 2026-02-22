/**
 * Example client-side implementation for the Realtime Server
 * This can be used in the React dashboard or any other frontend
 */

const socketIOClient = {
  /**
   * Initialize Socket.IO connection to realtime server
   * @param {string} url - Server URL (e.g., 'http://localhost:3001')
   * @returns {object} Socket instance and utility functions
   */
  connect(url = 'http://localhost:3001') {
    const socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    const listeners = {
      onJobAdded: [],
      onJobStarted: [],
      onJobCompleted: [],
      onJobFailed: [],
      onJobProgress: [],
      onMetricsUpdate: [],
      onWorkerStatusUpdate: [],
    };

    // Setup event listeners
    socket.on('initial:metrics', (data) => {
      console.log('Connected with initial metrics:', data);
      notifyListeners(listeners.onMetricsUpdate, {
        type: 'initial',
        data,
      });
    });

    socket.on('queue:job-added', (data) => {
      console.log('🆕 Job added:', data.job.id);
      notifyListeners(listeners.onJobAdded, data);
    });

    socket.on('queue:job-started', (data) => {
      console.log('▶️  Job started:', data.job.id);
      notifyListeners(listeners.onJobStarted, data);
    });

    socket.on('queue:job-completed', (data) => {
      console.log('✅ Job completed:', data.job.id);
      notifyListeners(listeners.onJobCompleted, data);
    });

    socket.on('queue:job-failed', (data) => {
      console.log('❌ Job failed:', data.job.id, '-', data.job.error);
      notifyListeners(listeners.onJobFailed, data);
    });

    socket.on('queue:job-progress', (data) => {
      console.log('📊 Job progress:', data.job.id, '-', data.job.progress + '%');
      notifyListeners(listeners.onJobProgress, data);
    });

    socket.on('queue:metrics', (data) => {
      console.log('📈 Queue metrics updated:', data.queue, data.metrics);
      notifyListeners(listeners.onMetricsUpdate, {
        type: 'metrics-update',
        data,
      });
    });

    socket.on('workers:status', (data) => {
      console.log('👥 Worker status:', data.active, 'active,', data.idle, 'idle');
      notifyListeners(listeners.onWorkerStatusUpdate, data);
    });

    socket.on('queue:drained', (data) => {
      console.log('✨ Queue drained:', data.queue);
    });

    socket.on('queue:error', (data) => {
      console.error('⚠️  Queue error:', data.queue, '-', data.error);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from realtime server');
    });

    // Utility functions
    return {
      socket,
      
      /**
       * Subscribe to job added events
       */
      onJobAdded(callback) {
        listeners.onJobAdded.push(callback);
        return () => {
          listeners.onJobAdded = listeners.onJobAdded.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to job started events
       */
      onJobStarted(callback) {
        listeners.onJobStarted.push(callback);
        return () => {
          listeners.onJobStarted = listeners.onJobStarted.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to job completed events
       */
      onJobCompleted(callback) {
        listeners.onJobCompleted.push(callback);
        return () => {
          listeners.onJobCompleted = listeners.onJobCompleted.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to job failed events
       */
      onJobFailed(callback) {
        listeners.onJobFailed.push(callback);
        return () => {
          listeners.onJobFailed = listeners.onJobFailed.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to job progress events
       */
      onJobProgress(callback) {
        listeners.onJobProgress.push(callback);
        return () => {
          listeners.onJobProgress = listeners.onJobProgress.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to metrics updates
       */
      onMetricsUpdate(callback) {
        listeners.onMetricsUpdate.push(callback);
        return () => {
          listeners.onMetricsUpdate = listeners.onMetricsUpdate.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Subscribe to worker status updates
       */
      onWorkerStatusUpdate(callback) {
        listeners.onWorkerStatusUpdate.push(callback);
        return () => {
          listeners.onWorkerStatusUpdate = listeners.onWorkerStatusUpdate.filter(
            (cb) => cb !== callback
          );
        };
      },

      /**
       * Request current metrics
       */
      requestMetrics() {
        return new Promise((resolve) => {
          socket.emit('request:metrics', (data) => {
            resolve(data);
          });
        });
      },

      /**
       * Request queue details
       */
      requestQueueDetails(queueName) {
        return new Promise((resolve) => {
          socket.emit('request:queue-details', queueName, (data) => {
            resolve(data);
          });
        });
      },

      /**
       * Disconnect from realtime server
       */
      disconnect() {
        socket.disconnect();
      },
    };
  },
};

// Helper function to notify all listeners
function notifyListeners(listeners, data) {
  listeners.forEach((callback) => {
    try {
      callback(data);
    } catch (error) {
      console.error('Error in listener callback:', error);
    }
  });
}

// Usage Example (in React component)
/*

import { useEffect, useState } from 'react';
import socketIOClient from './socketIOClient';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize realtime client
    const rtClient = socketIOClient.connect('http://localhost:3001');
    setClient(rtClient);

    // Subscribe to events
    const unsubscribeJobAdded = rtClient.onJobAdded((data) => {
      setJobs((prev) => [data.job, ...prev]);
    });

    const unsubscribeJobCompleted = rtClient.onJobCompleted((data) => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === data.job.id
            ? { ...job, status: 'completed', returnValue: data.job.returnValue }
            : job
        )
      );
    });

    const unsubscribeMetricsUpdate = rtClient.onMetricsUpdate((data) => {
      if (data.type === 'initial') {
        setMetrics(data.data.queues);
      } else if (data.type === 'metrics-update') {
        setMetrics((prev) => ({
          ...prev,
          [data.data.queue]: data.data.metrics,
        }));
      }
    });

    const unsubscribeWorkers = rtClient.onWorkerStatusUpdate((data) => {
      setWorkers(data);
    });

    // Cleanup
    return () => {
      unsubscribeJobAdded();
      unsubscribeJobCompleted();
      unsubscribeMetricsUpdate();
      unsubscribeWorkers();
      rtClient.disconnect();
    };
  }, []);

  if (!metrics || !workers) {
    return <div>Connecting to realtime server...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Queue Metrics</h2>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
      <div>
        <h2>Workers</h2>
        <p>Active: {workers.active}</p>
        <p>Idle: {workers.idle}</p>
      </div>
      <div>
        <h2>Recent Jobs</h2>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              {job.name} - {job.status || 'pending'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

*/

export default socketIOClient;
