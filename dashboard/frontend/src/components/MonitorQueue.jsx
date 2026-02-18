import { useState } from 'react'

export default function MonitorQueue() {
  const [filter, setFilter] = useState('all')

  const queueItems = [
    {
      id: 'TK-10043',
      taskName: 'Email Spam Detection',
      status: 'completed',
      priority: 'high',
      createdAt: '2 minutes ago',
      completedAt: '1 minute ago',
      worker: 'Worker 1',
      processingTime: '45s',
    },
    {
      id: 'TK-10042',
      taskName: 'Data Processing Job',
      status: 'completed',
      priority: 'medium',
      createdAt: '5 minutes ago',
      completedAt: '3 minutes ago',
      worker: 'Worker 3',
      processingTime: '120s',
    },
    {
      id: 'TK-10041',
      taskName: 'Image Analysis Task',
      status: 'processing',
      priority: 'high',
      createdAt: '8 seconds ago',
      worker: 'Worker 2',
      progress: 65,
    },
    {
      id: 'TK-10040',
      taskName: 'Text Analysis',
      status: 'processing',
      priority: 'medium',
      createdAt: '12 seconds ago',
      worker: 'Worker Py',
      progress: 32,
    },
    {
      id: 'TK-10039',
      taskName: 'ML Training Model',
      status: 'pending',
      priority: 'critical',
      createdAt: '30 seconds ago',
      estimatedWait: '3 minutes',
    },
    {
      id: 'TK-10038',
      taskName: 'Email Spam Detection',
      status: 'pending',
      priority: 'medium',
      createdAt: '45 seconds ago',
      estimatedWait: '5 minutes',
    },
    {
      id: 'TK-10037',
      taskName: 'Data Processing Job',
      status: 'failed',
      priority: 'low',
      createdAt: '2 hours ago',
      failedAt: '1 hour 55 minutes ago',
      error: 'Timeout exceeded',
      worker: 'Worker 1',
    },
  ]

  const filteredItems = queueItems.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  const stats = [
    { label: 'Total in Queue', value: queueItems.length, color: '#4299e1', icon: '📋' },
    {
      label: 'Processing',
      value: queueItems.filter((x) => x.status === 'processing').length,
      color: '#ed8936',
      icon: '⚙️',
    },
    {
      label: 'Pending',
      value: queueItems.filter((x) => x.status === 'pending').length,
      color: '#ecc94b',
      icon: '⏳',
    },
    {
      label: 'Completed',
      value: queueItems.filter((x) => x.status === 'completed').length,
      color: '#48bb78',
      icon: '✅',
    },
  ]


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#e53e3e'
      case 'high':
        return '#ed8936'
      case 'medium':
        return '#ecc94b'
      case 'low':
        return '#38a169'
      default:
        return '#718096'
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Monitor Request Queue</h1>
        <p className="page-subtitle">Track all tasks in the processing queue</p>
      </div>

      {/* Stats */}
      <div className="grid-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Queue Items */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Task Queue</div>
            <div className="card-subtitle">Real-time task processing queue with status updates</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #edf2f7' }}>
          <button
            className={`btn btn-small ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({queueItems.length})
          </button>
          <button
            className={`btn btn-small ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({queueItems.filter((x) => x.status === 'pending').length})
          </button>
          <button
            className={`btn btn-small ${filter === 'processing' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('processing')}
          >
            Processing ({queueItems.filter((x) => x.status === 'processing').length})
          </button>
          <button
            className={`btn btn-small ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({queueItems.filter((x) => x.status === 'completed').length})
          </button>
        </div>

        {/* Queue List */}
        <div>
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No tasks found</div>
              <p className="empty-text">No tasks match the current filter</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="queue-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '15px', color: '#2d3748' }}>{item.id}</strong>
                    <span
                      className={`badge ${
                        item.status === 'completed'
                          ? 'completed'
                          : item.status === 'processing'
                          ? 'active'
                          : item.status === 'failed'
                          ? 'inactive'
                          : 'pending'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: getPriorityColor(item.priority),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ color: '#2d3748', marginBottom: '8px', fontSize: '14px' }}>{item.taskName}</div>

                  <div className="queue-item-meta">
                    <span>📅 Created: {item.createdAt}</span>
                    {item.worker && <span>👷 Worker: {item.worker}</span>}

                    {item.status === 'processing' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Progress: {item.progress}%</span>
                      </div>
                    )}

                    {item.status === 'completed' && <span>✅ Completed: {item.completedAt} ({item.processingTime})</span>}

                    {item.status === 'pending' && <span>⏳ Est. Wait: {item.estimatedWait}</span>}

                    {item.status === 'failed' && <span style={{ color: '#e53e3e' }}>❌ Error: {item.error}</span>}
                  </div>

                  {item.status === 'processing' && (
                    <div
                      style={{
                        marginTop: '8px',
                        height: '6px',
                        backgroundColor: '#edf2f7',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${item.progress}%`,
                          backgroundColor: '#667eea',
                          transition: 'width 0.3s ease',
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <button className="btn btn-secondary btn-small" style={{ whiteSpace: 'nowrap', marginLeft: '16px' }}>
                  {item.status === 'failed' ? 'Retry' : 'View Details'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Queue Stats Card */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Queue Performance</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>Avg Processing Time</span>
                <strong style={{ color: '#2d3748' }}>2.3 seconds</strong>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>Success Rate</span>
                <strong style={{ color: '#48bb78' }}>98.5%</strong>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>Tasks/Hour</span>
                <strong style={{ color: '#2d3748' }}>3,247</strong>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>Avg Queue Wait</span>
                <strong style={{ color: '#2d3748' }}>1.2 seconds</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Failures</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {queueItems
              .filter((x) => x.status === 'failed')
              .map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '8px',
                    borderLeft: '3px solid #e53e3e',
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>{item.id}</div>
                  <div style={{ fontSize: '12px', color: '#c53030', marginTop: '4px' }}>Error: {item.error}</div>
                  <button className="btn btn-small" style={{ marginTop: '8px', fontSize: '11px' }}>
                    Retry
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
