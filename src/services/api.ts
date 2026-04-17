import { io, Socket } from 'socket.io-client'

class APIService {
  private socket: Socket | null = null
  private baseUrl: string
  private isConnected: boolean = false

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl
  }

  // Initialize WebSocket connection
  connectWebSocket() {
    if (this.socket?.connected) return
    
    this.socket = io(this.baseUrl, {
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('🔌 Connected to server')
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('❌ Disconnected from server')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Terminal operations via WebSocket
  initTerminal(options: { shell?: string; cols?: number; rows?: number; cwd?: string }) {
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket not connected'))
        return
      }

      this.socket.once('terminal:ready', () => resolve())
      this.socket.once('terminal:error', (error) => reject(error))
      
      this.socket.emit('terminal:init', options)
    })
  }

  writeTerminal(data: string) {
    this.socket?.emit('terminal:write', data)
  }

  resizeTerminal(cols: number, rows: number) {
    this.socket?.emit('terminal:resize', { cols, rows })
  }

  onTerminalData(callback: (data: string) => void) {
    this.socket?.on('terminal:data', callback)
  }

  offTerminalData(callback?: (data: string) => void) {
    if (callback) {
      this.socket?.off('terminal:data', callback)
    } else {
      this.socket?.off('terminal:data')
    }
  }

  // HTTP API calls
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // File operations
  async readFile(filePath: string): Promise<{ success: boolean; content?: string; error?: string }> {
    return this.request(`/api/files/read?path=${encodeURIComponent(filePath)}`)
  }

  async writeFile(filePath: string, content: string): Promise<{ success: boolean; error?: string }> {
    return this.request('/api/files/write', {
      method: 'POST',
      body: JSON.stringify({ path: filePath, content }),
    })
  }

  async listDirectory(dirPath: string): Promise<{ success: boolean; files?: Array<{ name: string; path: string; isDirectory: boolean }>; error?: string }> {
    return this.request(`/api/files/list?path=${encodeURIComponent(dirPath)}`)
  }

  // AI Chat
  async chatWithAI(params: {
    provider: string
    model: string
    messages: Array<{ role: string; content: string }>
    apiKey?: string
  }): Promise<any> {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // Command execution
  async executeCommand(command: string, cwd?: string): Promise<{ success: boolean; stdout?: string; stderr?: string; error?: string }> {
    return this.request('/api/commands/execute', {
      method: 'POST',
      body: JSON.stringify({ command, cwd }),
    })
  }

  // System info
  async getSystemInfo(): Promise<{
    platform: string
    arch: string
    totalMem: number
    freeMem: number
    cpus: any[]
    homedir: string
    nodeVersion: string
    uptime: number
  }> {
    return this.request('/api/system/info')
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/api/health')
  }

  // Check connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }
}

// Export singleton instance
export const apiService = new APIService()
export default apiService
