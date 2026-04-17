import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface FileTab {
  id: string
  name: string
  language: string
  content: string
  path: string
  isDirty?: boolean
}

export interface TerminalState {
  isActive: boolean
  output: string[]
  isRunning: boolean
}

export interface AIProvider {
  id: string
  name: string
  model: string
  apiKey?: string
  endpoint?: string
}

export interface ProjectConfig {
  name: string
  rootPath: string
  mcpEnabled: boolean
  aiProvider: string
}

interface AppState {
  messages: Message[]
  files: FileTab[]
  activeFileId: string | null
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  isProcessing: boolean
  terminal: TerminalState
  aiProviders: AIProvider[]
  activeProvider: string
  projectConfig: ProjectConfig | null
  recentProjects: string[]
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  openFile: (file: FileTab) => void
  closeFile: (fileId: string) => void
  setActiveFile: (fileId: string) => void
  updateFileContent: (fileId: string, content: string) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setIsProcessing: (processing: boolean) => void
  
  // Terminal actions
  setTerminalOutput: (output: string[]) => void
  appendTerminalOutput: (line: string) => void
  setTerminalRunning: (running: boolean) => void
  toggleTerminal: () => void
  clearTerminal: () => void
  
  // AI Provider actions
  addAIProvider: (provider: AIProvider) => void
  removeAIProvider: (providerId: string) => void
  setActiveProvider: (providerId: string) => void
  updateAIProvider: (providerId: string, updates: Partial<AIProvider>) => void
  
  // Project actions
  setProjectConfig: (config: ProjectConfig) => void
  addRecentProject: (path: string) => void
  removeRecentProject: (path: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  files: [],
  activeFileId: null,
  sidebarOpen: true,
  theme: 'dark',
  isProcessing: false,
  terminal: {
    isActive: false,
    output: [],
    isRunning: false,
  },
  aiProviders: [
    { id: 'openai', name: 'OpenAI', model: 'gpt-4-turbo' },
    { id: 'anthropic', name: 'Anthropic', model: 'claude-3-opus' },
    { id: 'qwen', name: 'Qwen', model: 'qwen-coder-plus' },
    { id: 'local', name: 'Local Model', model: 'custom' },
  ],
  activeProvider: 'qwen',
  projectConfig: null,
  recentProjects: [],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }]
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  openFile: (file) => set((state) => {
    const existingFile = state.files.find(f => f.path === file.path)
    if (existingFile) {
      return { activeFileId: existingFile.id }
    }
    return { 
      files: [...state.files, file],
      activeFileId: file.id 
    }
  }),
  
  closeFile: (fileId) => set((state) => {
    const newFiles = state.files.filter(f => f.id !== fileId)
    return {
      files: newFiles,
      activeFileId: state.activeFileId === fileId 
        ? (newFiles.length > 0 ? newFiles[newFiles.length - 1].id : null)
        : state.activeFileId
    }
  }),
  
  setActiveFile: (fileId) => set({ activeFileId: fileId }),
  
  updateFileContent: (fileId, content) => set((state) => ({
    files: state.files.map(f => 
      f.id === fileId ? { ...f, content, isDirty: true } : f
    )
  })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => set({ theme }),
  
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  // Terminal actions
  setTerminalOutput: (output) => set((state) => ({
    terminal: { ...state.terminal, output }
  })),
  
  appendTerminalOutput: (line) => set((state) => ({
    terminal: { 
      ...state.terminal, 
      output: [...state.terminal.output.slice(-999), line] 
    }
  })),
  
  setTerminalRunning: (isRunning) => set((state) => ({
    terminal: { ...state.terminal, isRunning }
  })),
  
  toggleTerminal: () => set((state) => ({
    terminal: { ...state.terminal, isActive: !state.terminal.isActive }
  })),
  
  clearTerminal: () => set((state) => ({
    terminal: { ...state.terminal, output: [] }
  })),
  
  // AI Provider actions
  addAIProvider: (provider) => set((state) => ({
    aiProviders: [...state.aiProviders, provider]
  })),
  
  removeAIProvider: (providerId) => set((state) => ({
    aiProviders: state.aiProviders.filter(p => p.id !== providerId),
    activeProvider: state.activeProvider === providerId 
      ? (state.aiProviders[0]?.id || 'local')
      : state.activeProvider
  })),
  
  setActiveProvider: (providerId) => set({ activeProvider: providerId }),
  
  updateAIProvider: (providerId, updates) => set((state) => ({
    aiProviders: state.aiProviders.map(p =>
      p.id === providerId ? { ...p, ...updates } : p
    )
  })),
  
  // Project actions
  setProjectConfig: (config) => set({ projectConfig: config }),
  
  addRecentProject: (pathToAdd) => set((state) => ({
    recentProjects: [pathToAdd, ...state.recentProjects.filter(p => p !== pathToAdd)].slice(0, 10)
  })),
  
  removeRecentProject: (pathToRemove) => set((state) => ({
    recentProjects: state.recentProjects.filter(p => p !== pathToRemove)
  })),
}))

