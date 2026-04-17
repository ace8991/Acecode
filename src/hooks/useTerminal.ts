import { useEffect, useState, useCallback } from 'react'

interface UseTerminalOptions {
  shell?: string
  cols?: number
  rows?: number
  cwd?: string
  enabled?: boolean
}

interface UseTerminalReturn {
  output: string[]
  isRunning: boolean
  isConnected: boolean
  error: string | null
  write: (data: string) => void
  resize: (cols: number, rows: number) => void
  clear: () => void
  connect: () => Promise<void>
  disconnect: () => void
}

export function useTerminal(options: UseTerminalOptions = {}): UseTerminalReturn {
  const {
    shell = 'bash',
    cols = 80,
    rows = 24,
    cwd,
    enabled = true,
  } = options

  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const connect = useCallback(async () => {
    if (!enabled) return
    
    try {
      // For web mode, we'll use the server WebSocket
      const wsUrl = `ws://localhost:3001`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('🔌 Terminal WebSocket connected')
        setIsConnected(true)
        setError(null)
        
        // Initialize terminal
        ws.send(JSON.stringify({
          type: 'terminal:init',
          payload: { shell, cols, rows, cwd }
        }))
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          switch (message.type) {
            case 'terminal:ready':
              setIsRunning(true)
              break
            case 'terminal:data':
              setOutput(prev => [...prev.slice(-999), message.payload])
              break
            case 'terminal:error':
              setError(message.payload)
              setIsRunning(false)
              break
          }
        } catch (e) {
          console.error('Failed to parse terminal message:', e)
        }
      }

      ws.onerror = (e) => {
        console.error('Terminal WebSocket error:', e)
        setError('Connection error')
      }

      ws.onclose = () => {
        console.log('Terminal WebSocket closed')
        setIsConnected(false)
        setIsRunning(false)
      }

      setSocket(ws)
    } catch (err: any) {
      setError(err.message)
    }
  }, [enabled, shell, cols, rows, cwd])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close()
      setSocket(null)
      setIsConnected(false)
      setIsRunning(false)
    }
  }, [socket])

  const write = useCallback((data: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'terminal:write',
        payload: data
      }))
    }
  }, [socket])

  const resize = useCallback((newCols: number, newRows: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'terminal:resize',
        payload: { cols: newCols, rows: newRows }
      }))
    }
  }, [socket])

  const clear = useCallback(() => {
    setOutput([])
  }, [])

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (enabled) {
      connect()
    }
    
    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only intercept if terminal is active and focused
      if (!isConnected || !isRunning) return
      
      // Ctrl+C handling
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        write('\x03')
      }
      
      // Ctrl+D handling
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        write('\x04')
      }
      
      // Ctrl+L for clear
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        clear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isConnected, isRunning, write, clear])

  return {
    output,
    isRunning,
    isConnected,
    error,
    write,
    resize,
    clear,
    connect,
    disconnect,
  }
}

export default useTerminal
