import { useSocket } from '../hooks/useSocket'

export default function MonitorWorkers() {
  const { isConnected, queueMetrics, workers } = useSocket()

  // Calculate totals from queue metrics
  const totalCompleted = Object.values(queueMetrics).reduce((sum, q) => sum + q.completed, 0)
  const totalActive = Object.values(queueMetrics).reduce((sum, q) => sum + q.active, 0)

  // Build worker list from active/idle workers or show default workers
  const workerList = [
    ...workers.active.map(w => ({
      id: w.id,
      name: w.id,
      status: 'active',
      queue: w.queue,
      currentJob: w.currentJob,
      processedJobs: w.processedJobs || 0,
      failedJobs: w.failedJobs || 0,
    })),
    ...workers.idle.map(w => ({
      id: w.id,
      name: w.id,
      status: 'idle',
      queue: w.queue,
      processedJobs: w.processedJobs || 0,
      failedJobs: w.failedJobs || 0,
    })),
  ]

  // Default workers if none reported yet
  const displayWorkers = workerList.length > 0 ? workerList : [
    { id: 'worker-node-1', name: 'Node Worker (api-integration)', status: 'active', queue: 'api-integration', processedJobs: 0 },
    { id: 'worker-node-2', name: 'Node Worker (data-transformation)', status: 'active', queue: 'data-transformation', processedJobs: 0 },
    { id: 'worker-py-1', name: 'Python Worker (email-spam)', status: 'active', queue: 'email-spam', processedJobs: 0 },
    { id: 'worker-py-2', name: 'Python Worker (dataset-validator)', status: 'active', queue: 'dataset-validator', processedJobs: 0 },
  ]

  const stats = [
    { label: 'Total Workers', value: displayWorkers.length, icon: '\ud83d\udc77', color: '#667eea' },
    { label: 'Active Workers', value: workers.active.length || displayWorkers.filter(w => w.status === 'active').length, icon: '\u2705', color: '#48bb78' },
    { label: 'Total Completed', value: totalCompleted.toLocaleString(), icon: '\u2714\ufe0f', color: '#4299e1' },
    { label: 'Currently Processing', value: totalActive, icon: '\u2699\ufe0f', color: '#ed8936' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">\ud83d\udc77 Monitor Workers</h1>
        <p className="page-subtitle">
          Track all active workers and their performance metrics
          <span style={{ marginLeft: '12px', fontSize: '12px', color: isConnected ? '#48bb78' : '#e53e3e' }}>
            {isConnected ? '\ud83d\udfe2 Connected' : '\ud83d\udd34 Disconnected'}
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Queue Metrics */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Queue Metrics</div>
            <div className="card-subtitle">Real-time metrics per queue</div>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Queue</th>
                <th>Waiting</th>
                <th>Active</th>
                <th>Completed</th>
                <th>Failed</th>
                <th>Delayed</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(queueMetrics).map(([queueName, metrics]) => (
                <tr key={queueName}>
                  <td><strong>{queueName}</strong></td>
                  <td style={{ color: metrics.waiting > 0 ? '#ecc94b' : '#718096' }}>{metrics.waiting}</td>
                  <td style={{ color: metrics.active > 0 ? '#ed8936' : '#718096' }}>{metrics.active}</td>
                  <td style={{ color: '#48bb78' }}>{metrics.completed}</td>
                  <td style={{ color: metrics.failed > 0 ? '#e53e3e' : '#718096' }}>{metrics.failed}</td>
                  <td style={{ color: '#718096' }}>{metrics.delayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workers List */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All Workers</div>
            <div className="card-subtitle">Real-time monitoring of all worker instances</div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Queue</th>
                <th>Status</th>
                <th>Jobs Processed</th>
                <th>Current Job</th>
              </tr>
            </thead>
            <tbody>
              {displayWorkers.map((worker) => (
                <tr key={worker.id}>
                  <td>
                    <strong>{worker.name || worker.id}</strong>
                  </td>
                  <td>{worker.queue || '-'}</td>
                  <td>
                    <span className={`badge ${worker.status}`}>{worker.status}</span>
                  </td>
                  <td>{(worker.processedJobs || 0).toLocaleString()}</td>
                  <td style={{ fontSize: '12px', color: '#718096' }}>
                    {worker.currentJob || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Details */}
      <div className="grid-2">
        {displayWorkers.map((worker) => (
          <div key={worker.id} className="card">
            <div className="card-header">
              <div className="card-title">{worker.name || worker.id}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>Status</span>
                <span className={`badge ${worker.status}`}>{worker.status}</span>
              </div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#718096', marginBottom: '4px' }}>Queue</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>
                      {worker.queue || '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#718096', marginBottom: '4px' }}>Jobs Processed</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>
                      {worker.processedJobs || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
