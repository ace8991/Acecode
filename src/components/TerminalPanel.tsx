import React from 'react'
import { Terminal, X, Minimize2, Maximize2, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Button } from './ui/Button'

interface TerminalPanelProps {
  className?: string
}

export function TerminalPanel({ className = '' }: TerminalPanelProps) {
  const { terminal, toggleTerminal, clearTerminal, appendTerminalOutput } = useAppStore()
  const terminalRef = React.useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = React.useState('')
  const [history, setHistory] = React.useState<string[]>([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminal.output])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = inputValue.trim()
      if (command) {
        // Add to history
        setHistory(prev => [...prev, command])
        setHistoryIndex(-1)
        
        // Append command to output
        appendTerminalOutput(`$ ${command}`)
        
        // Execute command (in real app, this would call the API)
        executeCommand(command)
        
        setInputValue('')
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInputValue(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInputValue('')
        } else {
          setHistoryIndex(newIndex)
          setInputValue(history[newIndex])
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      appendTerminalOutput('^C')
      setInputValue('')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      clearTerminal()
    }
  }

  const executeCommand = async (command: string) => {
    try {
      // Check if running in Electron
      if (window.electronAPI) {
        const result = await window.electronAPI.executeCommand(command)
        if (result.success) {
          if (result.stdout) appendTerminalOutput(result.stdout)
          if (result.stderr) appendTerminalOutput(result.stderr)
        } else {
          appendTerminalOutput(`Error: ${result.error}`)
        }
      } else {
        // Web mode - would connect to backend server
        appendTerminalOutput('[Web mode: Command execution requires backend server]')
      }
    } catch (error: any) {
      appendTerminalOutput(`Error: ${error.message}`)
    }
  }

  if (!terminal.isActive) {
    return null
  }

  return (
    <div className={`border-t border-border bg-terminal ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-terminal-header border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Terminal</span>
          {terminal.isRunning && (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="h-7 px-2"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTerminal}
            className="h-7 px-2"
            title="Close terminal"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="h-48 overflow-y-auto p-4 font-mono text-sm text-terminal-foreground"
      >
        {terminal.output.length === 0 ? (
          <div className="text-muted-foreground">
            <p>Welcome to Ultra Code Studio Terminal</p>
            <p className="mt-1">Type a command and press Enter to execute.</p>
            <p className="mt-1 text-xs">
              Tips: ↑/↓ for history, Ctrl+C to interrupt, Ctrl+L to clear
            </p>
          </div>
        ) : (
          terminal.output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap break-all">
              {line}
            </div>
          ))
        )}
      </div>

      {/* Terminal Input */}
      <div className="flex items-center px-4 py-2 border-t border-border bg-terminal-input">
        <span className="text-terminal-prompt mr-2">$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-terminal-foreground font-mono text-sm"
          placeholder="Enter command..."
          autoFocus
        />
      </div>
    </div>
  )
}

export default TerminalPanel
