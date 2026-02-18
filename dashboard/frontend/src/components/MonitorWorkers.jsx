export default function MonitorWorkers() {
  const workers = [
    {
      id: 1,
      name: 'Worker 1',
      status: 'active',
      tasksCompleted: 1247,
      tasksProcessing: 3,
      cpuUsage: 45,
      memoryUsage: 62,
      lastUpdated: '2 seconds ago',
    },
    {
      id: 2,
      name: 'Worker 2',
      status: 'active',
      tasksCompleted: 982,
      tasksProcessing: 5,
      cpuUsage: 78,
      memoryUsage: 85,
      lastUpdated: '1 second ago',
    },
    {
      id: 3,
      name: 'Worker 3',
      status: 'active',
      tasksCompleted: 1512,
      tasksProcessing: 2,
      cpuUsage: 32,
      memoryUsage: 48,
      lastUpdated: '3 seconds ago',
    },
    {
      id: 4,
      name: 'Worker Py (Python)',
      status: 'active',
      tasksCompleted: 856,
      tasksProcessing: 4,
      cpuUsage: 55,
      memoryUsage: 71,
      lastUpdated: '1 second ago',
    },
  ]

  const stats = [
    { label: 'Total Workers', value: '4', icon: '👷', color: '#667eea' },
    { label: 'Active Workers', value: '4', icon: '✅', color: '#48bb78' },
    { label: 'Total Tasks Processed', value: '4,597', icon: '✔️', color: '#4299e1' },
    { label: 'Avg Task Time', value: '2.3s', icon: '⏱️', color: '#ed8936' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👷 Monitor Workers</h1>
        <p className="page-subtitle">Track all active workers and their performance metrics</p>
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
                <th>Worker Name</th>
                <th>Status</th>
                <th>Tasks Completed</th>
                <th>Processing</th>
                <th>CPU Usage</th>
                <th>Memory Usage</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>
                    <strong>{worker.name}</strong>
                  </td>
                  <td>
                    <span className={`badge ${worker.status}`}>{worker.status}</span>
                  </td>
                  <td>{worker.tasksCompleted.toLocaleString()}</td>
                  <td>{worker.tasksProcessing}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#edf2f7',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${worker.cpuUsage}%`,
                            backgroundColor: worker.cpuUsage > 70 ? '#f56565' : '#48bb78',
                            borderRadius: '3px',
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#718096' }}>{worker.cpuUsage}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#edf2f7',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${worker.memoryUsage}%`,
                            backgroundColor: worker.memoryUsage > 80 ? '#f56565' : '#48bb78',
                            borderRadius: '3px',
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#718096' }}>{worker.memoryUsage}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#718096' }}>{worker.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Details */}
      <div className="grid-2">
        {workers.map((worker) => (
          <div key={worker.id} className="card">
            <div className="card-header">
              <div className="card-title">{worker.name}</div>
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
                    <div style={{ color: '#718096', marginBottom: '4px' }}>Tasks Completed</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
                      {worker.tasksCompleted}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#718096', marginBottom: '4px' }}>Currently Processing</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
                      {worker.tasksProcessing}
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-small" style={{ width: '100%' }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
