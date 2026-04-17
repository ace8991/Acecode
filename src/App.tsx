import { useAppStore } from '@/store/appStore'
import { Sidebar } from './components/Sidebar'
import { ChatPanel } from './components/ChatPanel'
import { CodeEditor } from './components/CodeEditor'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ResizablePanel'
import { TerminalPanel } from './components/TerminalPanel'
import { StatusBar } from './components/StatusBar'
import { useEffect } from 'react'
import { apiService } from '@/services/api'

function App() {
  const { theme, toggleTerminal } = useAppStore()
  
  // Initialize API service connection
  useEffect(() => {
    // Only connect in web mode (not in Electron)
    if (!window.electronAPI) {
      apiService.connectWebSocket()
    }
    
    return () => {
      if (!window.electronAPI) {
        apiService.disconnectWebSocket()
      }
    }
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + ` to toggle terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        toggleTerminal()
      }
      
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        // Sidebar toggle would be handled by sidebar component
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleTerminal])
  
  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 flex bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Editor panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <CodeEditor />
              <TerminalPanel />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Chat panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ChatPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}

export default App
