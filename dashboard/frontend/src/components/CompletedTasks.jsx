import React, { useState } from 'react'

function CompletedTasks() {
  const [completedTasks] = useState([
    {
      id: 'task-001',
      name: 'Email Spam Classification',
      status: 'completed',
      completedAt: '2026-02-23T14:32:15Z',
      executionTime: '2.5s',
      result: {
        processed: 150,
        spam: 45,
        legitimate: 105
      },
      outputFile: '/results/spam-classification-001.json',
      worker: 'worker1'
    },
    {
      id: 'task-002',
      name: 'Data Transformation Pipeline',
      status: 'completed',
      completedAt: '2026-02-23T14:28:42Z',
      executionTime: '1.8s',
      result: {
        rowsProcessed: 5000,
        transformationsApplied: 12,
        errorsFixed: 3
      },
      outputFile: '/results/transformed-data-002.csv',
      worker: 'workerPy'
    },
    {
      id: 'task-003',
      name: 'API Data Fetch',
      status: 'completed',
      completedAt: '2026-02-23T14:25:10Z',
      executionTime: '3.2s',
      result: {
        recordsFetched: 250,
        endpoints: 5,
        totalBytes: '2.1MB'
      },
      outputFile: '/results/api-dump-003.json',
      worker: 'worker1'
    },
    {
      id: 'task-004',
      name: 'ML Model Training',
      status: 'completed',
      completedAt: '2026-02-23T14:15:33Z',
      executionTime: '45.3s',
      result: {
        accuracy: '94.2%',
        precision: '92.8%',
        recall: '95.1%'
      },
      outputFile: '/results/trained-model-004.pkl',
      worker: 'workerPy'
    },
    {
      id: 'task-005',
      name: 'Report Generation',
      status: 'completed',
      completedAt: '2026-02-23T14:10:22Z',
      executionTime: '1.2s',
      result: {
        pages: 42,
        charts: 8,
        tables: 15
      },
      outputFile: '/results/report-005.pdf',
      worker: 'worker1'
    }
  ])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Completed Tasks</h2>
      
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
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Task ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Task Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Worker</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Completed At</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Execution Time</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Output File</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task, index) => (
              <tr 
                key={task.id}
                style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                }}
              >
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                  {task.id}
                </td>
                <td style={{ padding: '12px' }}>
                  {task.name}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    backgroundColor: task.worker === 'worker1' ? '#e3f2fd' : '#f3e5f5',
                    color: task.worker === 'worker1' ? '#1976d2' : '#7b1fa2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {task.worker}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '12px' }}>
                  {formatDate(task.completedAt)}
                </td>
                <td style={{ padding: '12px', fontSize: '12px' }}>
                  {task.executionTime}
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
                    ✓ {task.status}
                  </span>
                </td>
                <td style={{ 
                  padding: '12px', 
                  fontSize: '12px',
                  color: '#1976d2',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                  {task.outputFile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Completed</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
            {completedTasks.length}
          </div>
        </div>
        <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Avg Execution Time</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100' }}>
            10.2s
          </div>
        </div>
        <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Success Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0' }}>
            100%
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompletedTasks