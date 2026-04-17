import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
  
  // Dialog operations
  openDialog: (options: any) => ipcRenderer.invoke('open-dialog', options),
  saveDialog: (options: any) => ipcRenderer.invoke('save-dialog', options),
  
  // Command execution
  executeCommand: (command: string, cwd?: string) => ipcRenderer.invoke('execute-command', command, cwd),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Terminal operations
  terminalCreate: (options: any) => ipcRenderer.invoke('terminal-create', options),
  terminalWrite: (data: string) => ipcRenderer.invoke('terminal-write', data),
  terminalResize: (cols: number, rows: number) => ipcRenderer.invoke('terminal-resize', cols, rows),
  terminalKill: () => ipcRenderer.invoke('terminal-kill'),
  
  // Event listeners
  onTerminalData: (callback: (data: string) => void) => {
    ipcRenderer.on('terminal-data', (event, data) => callback(data))
  },
  removeTerminalDataListener: () => {
    ipcRenderer.removeAllListeners('terminal-data')
  },
  
  // Platform check
  platform: process.platform,
})

// Type definitions for the exposed API
export interface ElectronAPI {
  readFile: (filePath: string) => Promise<any>
  writeFile: (filePath: string, content: string) => Promise<any>
  readDirectory: (dirPath: string) => Promise<any>
  openDialog: (options: any) => Promise<any>
  saveDialog: (options: any) => Promise<any>
  executeCommand: (command: string, cwd?: string) => Promise<any>
  getSystemInfo: () => Promise<any>
  terminalCreate: (options: any) => Promise<any>
  terminalWrite: (data: string) => Promise<any>
  terminalResize: (cols: number, rows: number) => Promise<any>
  terminalKill: () => Promise<any>
  onTerminalData: (callback: (data: string) => void) => void
  removeTerminalDataListener: () => void
  platform: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
