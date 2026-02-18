export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="sidebar-icon">📊</span>
          <div>
            <div>TaskHub</div>
            <div style={{ fontSize: '11px', opacity: '0.8' }}>Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="nav-items">
        <button
          className={`nav-item ${activeSection === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveSection('workers')}
        >
          <span className="nav-item-icon">👷</span>
          <span>Monitor Workers</span>
        </button>

        <button
          className={`nav-item ${activeSection === 'create-task' ? 'active' : ''}`}
          onClick={() => setActiveSection('create-task')}
        >
          <span className="nav-item-icon">➕</span>
          <span>Create Task</span>
        </button>

        <button
          className={`nav-item ${activeSection === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveSection('queue')}
        >
          <span className="nav-item-icon">📋</span>
          <span>Monitor Queue</span>
        </button>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '20px 0' }} />

        <button className="nav-item" style={{ opacity: '0.6', cursor: 'not-allowed' }}>
          <span className="nav-item-icon">⚙️</span>
          <span>Settings</span>
        </button>

        <button className="nav-item" style={{ opacity: '0.6', cursor: 'not-allowed' }}>
          <span className="nav-item-icon">📊</span>
          <span>Analytics</span>
        </button>
      </nav>
    </div>
  )
}
