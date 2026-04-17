import React from 'react'
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Server, 
  Database,
  GitBranch,
  Terminal as TerminalIcon,
  Settings,
  Info,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Button } from './ui/Button'
import { apiService } from '@/services/api'

interface StatusBarItem {
  icon: React.ReactNode
  label: string
  value: string | number
  status?: 'ok' | 'warning' | 'error'
}

export function StatusBar() {
  const { terminal, activeProvider, aiProviders } = useAppStore()
  const [systemInfo, setSystemInfo] = React.useState<any>(null)
  const [serverStatus, setServerStatus] = React.useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  const [gitBranch, setGitBranch] = React.useState<string>('main')

  // Fetch system info on mount
  React.useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        if (window.electronAPI) {
          const info = await window.electronAPI.getSystemInfo()
          setSystemInfo(info)
        } else {
          const info = await apiService.getSystemInfo()
          setSystemInfo(info)
        }
      } catch (error) {
        console.error('Failed to fetch system info:', error)
      }
    }

    fetchSystemInfo()
    
    // Update every 30 seconds
    const interval = setInterval(fetchSystemInfo, 30000)
    return () => clearInterval(interval)
  }, [])

  // Check server connection
  React.useEffect(() => {
    const checkServer = async () => {
      setServerStatus('connecting')
      try {
        await apiService.healthCheck()
        setServerStatus('connected')
      } catch {
        setServerStatus('disconnected')
      }
    }

    checkServer()
    
    // Check every 10 seconds
    const interval = setInterval(checkServer, 10000)
    return () => clearInterval(interval)
  }, [])

  // Get git branch (simplified - in real app would use actual git commands)
  React.useEffect(() => {
    const getGitBranch = async () => {
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.executeCommand('git branch --show-current')
          if (result.success && result.stdout) {
            setGitBranch(result.stdout.trim())
          }
        }
      } catch {
        // Ignore errors
      }
    }

    getGitBranch()
  }, [])

  const formatMemory = (bytes: number) => {
    if (!bytes) return 'N/A'
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(1)} GB`
  }

  const statusItems: StatusBarItem[] = [
    {
      icon: <Cpu className="w-3.5 h-3.5" />,
      label: 'Platform',
      value: systemInfo?.platform || 'Unknown',
      status: 'ok',
    },
    {
      icon: <HardDrive className="w-3.5 h-3.5" />,
      label: 'Memory',
      value: `${formatMemory(systemInfo?.freeMem)} / ${formatMemory(systemInfo?.totalMem)}`,
      status: systemInfo?.freeMem && systemInfo?.freeMem < 1024 * 1024 * 1024 ? 'warning' : 'ok',
    },
    {
      icon: serverStatus === 'connected' ? <Wifi className="w-3.5 h-3.5 text-green-500" /> : <WifiOff className="w-3.5 h-3.5 text-red-500" />,
      label: 'Server',
      value: serverStatus === 'connected' ? 'Online' : 'Offline',
      status: serverStatus === 'connected' ? 'ok' : 'error',
    },
    {
      icon: <GitBranch className="w-3.5 h-3.5" />,
      label: 'Branch',
      value: gitBranch,
      status: 'ok',
    },
    {
      icon: terminal.isActive ? <TerminalIcon className="w-3.5 h-3.5 text-green-500" /> : <TerminalIcon className="w-3.5 h-3.5" />,
      label: 'Terminal',
      value: terminal.isActive ? (terminal.isRunning ? 'Active' : 'Ready') : 'Closed',
      status: terminal.isActive ? 'ok' : undefined,
    },
  ]

  const activeProviderInfo = aiProviders.find(p => p.id === activeProvider)

  return (
    <div className="h-8 bg-statusbar border-t border-border flex items-center justify-between px-3 text-xs">
      {/* Left side - System status */}
      <div className="flex items-center gap-4">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-default"
            title={`${item.label}: ${item.value}`}
          >
            {item.icon}
            <span>{item.value}</span>
            {item.status === 'ok' && <CheckCircle className="w-3 h-3 text-green-500" />}
            {item.status === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-500" />}
            {item.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
        ))}
      </div>

      {/* Right side - AI Provider and actions */}
      <div className="flex items-center gap-3">
        {/* AI Provider */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/50">
          <Server className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">{activeProviderInfo?.name || 'AI'}</span>
          <span className="text-muted-foreground">({activeProviderInfo?.model || 'default'})</span>
        </div>

        {/* MCP Status */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Database className="w-3.5 h-3.5" />
          <span>MCP</span>
        </div>

        {/* Settings button */}
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Settings className="w-3.5 h-3.5" />
        </Button>

        {/* Info button */}
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Info className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default StatusBar
