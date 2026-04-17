import React from 'react'
import { 
  FolderTree, 
  Search, 
  GitBranch, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Code2,
  Files
} from 'lucide-react'
import { Button } from './ui/Button'
import { FileTree } from './FileTree'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

type SidebarTab = 'files' | 'search' | 'git' | 'settings'

export function Sidebar() {
  const [activeTab, setActiveTab] = React.useState<SidebarTab>('files')
  const { sidebarOpen, toggleSidebar } = useAppStore()
  
  const handleFileSelect = (file: any) => {
    console.log('File selected:', file)
    // In a real app, this would open the file in the editor
  }
  
  if (!sidebarOpen) {
    return (
      <div className="w-12 border-r border-border bg-muted/30 flex flex-col items-center py-4 gap-2">
        <Button variant="ghost" size="sm" onClick={toggleSidebar}>
          <ChevronRight className="w-5 h-5" />
        </Button>
        
        <div className="flex-1" />
        
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    )
  }
  
  return (
    <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Ultra Code</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleSidebar}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Activity Bar */}
      <div className="flex items-center gap-1 p-2 border-b border-border">
        <Button
          variant={activeTab === 'files' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('files')}
          className="flex-1"
        >
          <Files className="w-4 h-4 mr-2" />
          Files
        </Button>
        <Button
          variant={activeTab === 'search' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('search')}
          className="flex-1"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          variant={activeTab === 'git' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('git')}
          className="flex-1"
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Git
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'files' && (
          <div className="h-full overflow-y-auto p-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
              Explorer
            </div>
            <FileTree onFileSelect={handleFileSelect} />
          </div>
        )}
        
        {activeTab === 'search' && (
          <div className="p-4">
            <div className="text-sm text-muted-foreground text-center mt-8">
              Search functionality coming soon...
            </div>
          </div>
        )}
        
        {activeTab === 'git' && (
          <div className="p-4">
            <div className="text-sm text-muted-foreground text-center mt-8">
              Git integration coming soon...
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="text-sm text-muted-foreground text-center mt-8">
              Settings panel coming soon...
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Ultra Code Studio v1.0
        </div>
      </div>
    </div>
  )
}
