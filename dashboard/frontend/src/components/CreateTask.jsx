import { useState } from 'react'

export default function CreateTask() {
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    taskType: 'email-spam',
    priority: 'medium',
    timeout: '300',
    retryCount: '3',
    apiEndpoint: 'jokes',
  })

  const [submitted, setSubmitted] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  const freeAPIs = [
    {
      id: 'jokes',
      name: '😂 Jokes API',
      description: 'Get random jokes',
      url: 'https://official-joke-api.appspot.com/random_joke',
      method: 'GET',
    },
    {
      id: 'pokemon',
      name: '⚡ PokéAPI',
      description: 'Pokémon data and information',
      url: 'https://pokeapi.co/api/v2/pokemon/ditto',
      method: 'GET',
    },
    {
      id: 'weather',
      name: '🌤️ Open-Meteo Weather',
      description: 'Weather data worldwide (no API key needed)',
      url: 'https://api.open-meteo.com/v1/forecast?latitude=40&longitude=-74&current=temperature',
      method: 'GET',
    },
    {
      id: 'quotes',
      name: '💭 Quotable Quotes',
      description: 'Random inspirational quotes',
      url: 'https://api.quotable.io/random',
      method: 'GET',
    },
    {
      id: 'cat-facts',
      name: '🐱 Cat Facts',
      description: 'Random facts about cats',
      url: 'https://catfact.ninja/fact',
      method: 'GET',
    },
    {
      id: 'dogs',
      name: '🐕 Dog API',
      description: 'Random dog images and info',
      url: 'https://dog.ceo/api/breeds/image/random',
      method: 'GET',
    },
    {
      id: 'advice',
      name: '💡 Advice Slip',
      description: 'Random advice slips',
      url: 'https://api.adviceslip.com/advice',
      method: 'GET',
    },
    {
      id: 'users',
      name: '👥 RandomUser',
      description: 'Generate random user profiles',
      url: 'https://randomuser.me/api/',
      method: 'GET',
    },
    {
      id: 'http-cat',
      name: '🐱 HTTP Cats',
      description: 'HTTP status codes explained with cats',
      url: 'https://http.cat/200',
      method: 'GET',
    },
    {
      id: 'bored',
      name: '😎 Bored API',
      description: 'Activity suggestions when bored',
      url: 'https://www.boredapi.com/api/activity',
      method: 'GET',
    },
    {
      id: 'university',
      name: '🎓 University Search',
      description: 'Search universities by country',
      url: 'https://universities.hipolabs.com/search?country=United%20States',
      method: 'GET',
    },
    {
      id: 'github-users',
      name: '🐙 GitHub Users',
      description: 'Get GitHub user information',
      url: 'https://api.github.com/users/github',
      method: 'GET',
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }
const handleFormatChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('taskId', `TK-${Date.now()}`)
      formDataToSend.append('taskName', formData.taskName)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('taskType', formData.taskType)
      formDataToSend.append('priority', formData.priority)
      formDataToSend.append('timeout', formData.timeout)
      formDataToSend.append('retryCount', formData.retryCount)
      
      // Add context-specific data
      if (formData.taskType === 'email-spam' || formData.taskType === 'text-analysis') {
        formDataToSend.append('textInput', textInput)
      }

      if (formData.taskType === 'api-integration') {
        const selectedAPI = freeAPIs.find(api => api.id === formData.apiEndpoint)
        formDataToSend.append('apiEndpoint', selectedAPI?.url)
        formDataToSend.append('apiName', selectedAPI?.name)
      }
      
      if (formData.taskType === 'data-transformation' && uploadedFile) {
        formDataToSend.append('uploadedFile', uploadedFile)
        formDataToSend.append('outputFormat', formData.outputFormat)
      }
      
      const response = await fetch('/api/addTasks', {
        method: 'POST',
        body: formDataToSend,
      })
      
      if (response.ok) {
        const data = await response.json()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        
        // Reset form
        setFormData({
          taskName: '',
          description: '',
          taskType: 'email-spam',
          priority: 'medium',
          timeout: '300',
          retryCount: '3',
          apiEndpoint: 'jokes',
        })
        setTextInput('')
        setUploadedFile(null)
      } else {
        console.error('Failed to submit task')
      }
    } catch (error) {
      console.error('Error submitting task:', error)
    }
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
                  <option value="dataset-validator">📝 Dataset Validator</option>
                
                </optgroup>
                <optgroup label="🟩 Node.js Workers">
                 
                  <option value="api-integration">🔌 API Integration</option>
                  <option value="data-transformation">🔄 Data Transformation</option>
               
                </optgroup>
              </select>
            </div>

            {(formData.taskType === 'email-spam') && (
              <div className="form-group">
                <label className="form-label required">
                  {formData.taskType === 'email-spam' ? 'Email Text' : 'Text to Analyze'}
                </label>
                <textarea
                  className="form-textarea"
                  placeholder={
                    formData.taskType === 'email-spam'
                      ? 'Enter email content to check for spam...'
                      : 'Enter text to analyze...'
                  }
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows="6"
                />
              </div>
            )}

            {formData.taskType === 'api-integration' && (
              <div className="form-group">
                <label className="form-label required">Select API Endpoint</label>
                <select
                  name="apiEndpoint"
                  className="form-select"
                  value={formData.apiEndpoint}
                  onChange={handleChange}
                >
                  {freeAPIs.map((api) => (
                    <option key={api.id} value={api.id}>
                      {api.name} - {api.description}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '12px', fontSize: '13px', backgroundColor: '#f0f4ff', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #667eea' }}>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Selected API:</div>
                  <div style={{ color: '#2d3748', marginBottom: '4px' }}>
                    <strong>URL:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#667eea' }}>{freeAPIs.find(api => api.id === formData.apiEndpoint)?.url}</span>
                  </div>
                  <div style={{ color: '#2d3748' }}>
                    <strong>Method:</strong> <span style={{ backgroundColor: '#e6f0ff', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '12px' }}>GET</span>
                  </div>
                </div>
              </div>
            )}

            {(formData.taskType === 'data-transformation' || formData.taskType === 'dataset-validator') && (
              <div className="form-group">
                <label className="form-label required">Upload File</label>
                <div
                  style={{
                    border: '2px dashed #667eea',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#f7fafc',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv,.json,.xml"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  {uploadedFile ? (
                    <div>
                      <div style={{ fontSize: '14px', color: '#48bb78', fontWeight: '600' }}>
                        ✅ File selected: {uploadedFile.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                        Click to change file
                      </div>
                    
                    </div>
                    
                    
                  ) : (
                    <div>
                      <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '600' }}>
                        📁 Click to upload or drag and drop
                      </div>
                      {
                        formData.taskType === 'data-transformation' ? (
                          <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                            Upload a CSV file to transform
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                            Upload a CSV file to validate
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>
                {
                  uploadedFile&&(
                      
                        formData.taskType=="data-transformation"&&(
                          <div style={{ fontSize: '12px', color: '#718096', marginTop: '15px' }}>
                            <h2>Choose output format</h2>
                            <div style={{
                              display:'flex',
                              gap:'10px',
                              marginTop:'5px'
                            }}>
                              <label>
                                <input type="radio" name="format" value="csv" onChange={handleFormatChange} />
                                CSV
                              </label>
                              <label>
                                <input type="radio" name="format" value="json" onChange={handleFormatChange} />
                                JSON
                              </label>
                              <label>
                                <input type="radio" name="format" value="xml" onChange={handleFormatChange} />
                                XML
                              </label>
                              </div>
                            </div>
                        )
                      
                  )
                }
              </div>
            )}

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
                onClick={() => {
                  setFormData({
                    taskName: '',
                    description: '',
                    taskType: 'email-spam',
                    priority: 'medium',
                    timeout: '300',
                    retryCount: '3',
                    apiEndpoint: 'jokes',
                  })
                  setTextInput('')
                  setUploadedFile(null)
                }}
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
              <div className="card-title">📡 Available Free APIs</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {freeAPIs.map((api) => (
                <div
                  key={api.id}
                  style={{
                    padding: '10px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${formData.apiEndpoint === api.id ? '#667eea' : '#cbd5e0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setFormData({ ...formData, taskType: 'api-integration', apiEndpoint: api.id })}
                >
                  <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '13px' }}>{api.name}</div>
                  <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>{api.description}</div>
                  <div style={{ fontSize: '10px', color: '#a0aec0', marginTop: '4px', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {api.url}
                  </div>
                </div>
              ))}
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
