import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// File operations
app.get('/api/files/read', async (req, res) => {
  try {
    const filePath = req.query.path as string
    if (!filePath) {
      return res.status(400).json({ error: 'Path required' })
    }
    const content = await fs.promises.readFile(filePath, 'utf-8')
    res.json({ success: true, content })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/files/write', async (req, res) => {
  try {
    const { path: filePath, content } = req.body
    if (!filePath) {
      return res.status(400).json({ error: 'Path required' })
    }
    await fs.promises.writeFile(filePath, content, 'utf-8')
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/files/list', async (req, res) => {
  try {
    const dirPath = req.query.path as string || process.cwd()
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true })
    const files = items.map(item => ({
      name: item.name,
      path: path.join(dirPath, item.name),
      isDirectory: item.isDirectory(),
    }))
    res.json({ success: true, files })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Terminal via WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  let ptyProcess: any = null
  
  socket.on('terminal:init', async (options: any) => {
    try {
      const pty = await import('node-pty')
      ptyProcess = pty.spawn(options.shell || 'bash', [], {
        name: 'xterm-color',
        cols: options.cols || 80,
        rows: options.rows || 24,
        cwd: options.cwd || process.env.HOME,
        env: process.env as any,
      })
      
      ptyProcess.onData((data: string) => {
        socket.emit('terminal:data', data)
      })
      
      socket.emit('terminal:ready')
    } catch (error: any) {
      socket.emit('terminal:error', error.message)
    }
  })
  
  socket.on('terminal:write', (data: string) => {
    if (ptyProcess) {
      ptyProcess.write(data)
    }
  })
  
  socket.on('terminal:resize', (options: { cols: number; rows: number }) => {
    if (ptyProcess) {
      ptyProcess.resize(options.cols, options.rows)
    }
  })
  
  socket.on('disconnect', () => {
    if (ptyProcess) {
      ptyProcess.kill()
    }
    console.log('Client disconnected:', socket.id)
  })
})

// AI Proxy endpoint (for connecting to various AI providers)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { provider, model, messages, apiKey } = req.body
    
    // This is a placeholder - in production you'd integrate with actual AI APIs
    // OpenAI, Anthropic, Qwen, etc.
    
    const mockResponse = {
      id: 'mock-' + Date.now(),
      choices: [{
        message: {
          role: 'assistant',
          content: `This is a mock response. Configure your AI provider API key to get real responses.\n\nProvider: ${provider}\nModel: ${model}\n\nI can help you with:\n- Code analysis and review\n- Debugging assistance\n- Code generation\n- Refactoring suggestions\n- Test generation\n- Documentation`,
        },
      }],
      usage: { prompt_tokens: 0, completion_tokens: 100, total_tokens: 100 },
    }
    
    res.json(mockResponse)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Command execution endpoint
app.post('/api/commands/execute', async (req, res) => {
  try {
    const { command, cwd } = req.body
    const { stdout, stderr } = await execAsync(command, {
      cwd: cwd || process.cwd(),
      maxBuffer: 1024 * 1024 * 10,
    })
    res.json({ success: true, stdout, stderr })
  } catch (error: any) {
    res.json({ success: false, error: error.message, stderr: error.stderr })
  }
})

// System info endpoint
app.get('/api/system/info', async (req, res) => {
  const os = await import('os')
  res.json({
    platform: os.platform(),
    arch: os.arch(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    cpus: os.cpus(),
    homedir: os.homedir(),
    nodeVersion: process.version,
    uptime: os.uptime(),
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

httpServer.listen(PORT, () => {
  console.log(`🚀 Ultra Code Studio Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🔌 API available at http://localhost:${PORT}/api`)
})

export { app, httpServer, io }
