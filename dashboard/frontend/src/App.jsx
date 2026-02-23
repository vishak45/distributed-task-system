import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MonitorWorkers from './components/MonitorWorkers'
import CreateTask from './components/CreateTask'
import MonitorQueue from './components/MonitorQueue'
import CompletedTasks from './components/CompletedTasks'
function App() {
  const [activeSection, setActiveSection] = useState('workers')

  const renderContent = () => {
    switch (activeSection) {
      case 'workers':
        return <MonitorWorkers />
      case 'create-task':
        return <CreateTask />
      case 'queue':
        return <MonitorQueue />
      case 'completed-tasks':
        return  <CompletedTasks />
      default:
        return <MonitorWorkers />
    }
  }

  return (
    <div className="app-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
