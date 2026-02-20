import { useState } from 'react'

export default function CreateTask() {
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    taskType: 'email-spam',
    priority: 'medium',
    timeout: '300',
    retryCount: '3',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">➕ Create New Task</h1>
        <p className="page-subtitle">Add a new task to the processing queue</p>
      </div>

      {submitted && (
        <div className="alert alert-success">
          <span>✅</span>
          <div>Task created successfully! Task ID: #TK-{Math.floor(Math.random() * 10000)}</div>
        </div>
      )}

      <div className="grid-2">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Task Details</div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Task Name</label>
              <input
                type="text"
                name="taskName"
                className="form-input"
                placeholder="Enter task name"
                value={formData.taskName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Enter task description (optional)"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label required">Task Type</label>
              <select
                name="taskType"
                className="form-select"
                value={formData.taskType}
                onChange={handleChange}
              >
                <optgroup label="🐍 Python Workers">
                  <option value="email-spam">📧 Email Spam Detection</option>
                  <option value="text-analysis">📝 Text Analysis</option>
                  <option value="ml-training">🤖 ML Training</option>
                </optgroup>
                <optgroup label="🟩 Node.js Workers">
                 
                  <option value="api-integration">🔌 API Integration</option>
                  <option value="data-transformation">🔄 Data Transformation</option>
               
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Timeout (seconds)</label>
                <input
                  type="number"
                  name="timeout"
                  className="form-input"
                  placeholder="300"
                  value={formData.timeout}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Retry Count</label>
                <input
                  type="number"
                  name="retryCount"
                  className="form-input"
                  placeholder="3"
                  value={formData.retryCount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary btn-block">
                Create Task
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() =>
                  setFormData({
                    taskName: '',
                    description: '',
                    taskType: 'email-spam',
                    priority: 'medium',
                    timeout: '300',
                    retryCount: '3',
                  })
                }
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Info & Examples */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Task Information</div>
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '16px' }}>Create new tasks to be processed by available workers in the system.</p>
              <h4 style={{ marginTop: '20px', marginBottom: '8px', color: '#2d3748' }}>Task Types Available:</h4>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#667eea' }}>🐍 Python Workers:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                    <li>📧 Email Spam Detection</li>
                    <li>📝 Text Analysis</li>
                    <li>🤖 ML Training</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#48bb78' }}>🟩 Node.js Workers:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                  
                    <li>🔌 API Integration - Fetch and process external API data</li>
                    <li>🔄 Data Transformation - Convert between formats (CSV/JSON/XML)</li>
                  </ul>
                </div>
              </div>
              <h4 style={{ marginTop: '20px', marginBottom: '8px', color: '#2d3748' }}>Priority Levels:</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li>🟢 Low - Standard processing</li>
                <li>🟡 Medium - Normal queue</li>
                <li>🔴 High - Priority queue</li>
                <li>⛔ Critical - Express processing</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Tasks</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px',
                    borderLeft: '3px solid #667eea',
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>Task #{1000 + i}</div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                    Email Spam Detection • {i === 1 ? '2 minutes ago' : `${i + 1} minutes ago`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
