import { useSocket } from '../hooks/useSocket'

function CompletedTasks() {
  const { isConnected, completedJobs, queueMetrics } = useSocket()

  // Calculate total completed from queue metrics
  const totalCompleted = Object.values(queueMetrics).reduce((sum, q) => sum + q.completed, 0)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        Completed Tasks
        <span style={{ marginLeft: '12px', fontSize: '12px', color: isConnected ? '#48bb78' : '#e53e3e' }}>
          {isConnected ? '\ud83d\udfe2 Live' : '\ud83d\udd34 Disconnected'}
        </span>
      </h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Job Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Queue</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Completed At</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {completedJobs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                  No completed jobs yet. Tasks will appear here as they complete.
                </td>
              </tr>
            ) : (
              completedJobs.map((job, index) => (
                <tr 
                  key={job.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                  }}
                >
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                    {job.id}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {job.name || '-'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {job.queue}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {formatDate(job.completedAt)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: '#c8e6c9',
                      color: '#2e7d32',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      \u2713 completed
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {job.result ? (
                      <details>
                        <summary style={{ cursor: 'pointer', color: '#1976d2' }}>View Result</summary>
                        <pre style={{ fontSize: '10px', marginTop: '8px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', overflow: 'auto', maxHeight: '100px' }}>
                          {JSON.stringify(job.result, null, 2)}
                        </pre>
                      </details>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Completed (All Queues)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
            {totalCompleted.toLocaleString()}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Recent Completed</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100' }}>
            {completedJobs.length}
          </div>
        </div>
        {Object.entries(queueMetrics).map(([queueName, metrics]) => (
          <div key={queueName} style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>{queueName}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0' }}>
              {metrics.completed} completed
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedTasks