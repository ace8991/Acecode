import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 10 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#1a1a2e',
  })

  // Load app
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC Handlers for File System Operations
ipcMain.handle('read-file', async (event, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return { success: true, content }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('read-directory', async (event, dirPath: string) => {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    const files = items.map(item => ({
      name: item.name,
      path: path.join(dirPath, item.name),
      isDirectory: item.isDirectory(),
    }))
    return { success: true, files }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('open-dialog', async (event, options: any) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow!, options)
    return { success: true, ...result }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('save-dialog', async (event, options: any) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow!, options)
    return { success: true, ...result }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('execute-command', async (event, command: string, cwd?: string) => {
  const { exec } = await import('child_process')
  return new Promise((resolve) => {
    exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout,
        stderr,
        error: error?.message,
      })
    })
  })
})

ipcMain.handle('get-system-info', async () => {
  const os = await import('os')
  return {
    platform: os.platform(),
    arch: os.arch(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    cpus: os.cpus(),
    homedir: os.homedir(),
  }
})

// Terminal PTY support
let ptyProcess: any = null

ipcMain.handle('terminal-create', async (event, options: any) => {
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
      mainWindow?.webContents.send('terminal-data', data)
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('terminal-write', async (event, data: string) => {
  if (ptyProcess) {
    ptyProcess.write(data)
  }
  return { success: true }
})

ipcMain.handle('terminal-resize', async (event, cols: number, rows: number) => {
  if (ptyProcess) {
    ptyProcess.resize(cols, rows)
  }
  return { success: true }
})

ipcMain.handle('terminal-kill', async () => {
  if (ptyProcess) {
    ptyProcess.kill()
    ptyProcess = null
  }
  return { success: true }
})
