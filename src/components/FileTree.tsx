import React from 'react'
import { ChevronRight, ChevronDown, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileTreeItem {
  id: string
  name: string
  type: 'file' | 'folder'
  language?: string
  children?: FileTreeItem[]
  path: string
}

const sampleFiles: FileTreeItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [
          { id: '3', name: 'Button.tsx', type: 'file', language: 'typescript', path: '/src/components/Button.tsx' },
          { id: '4', name: 'Input.tsx', type: 'file', language: 'typescript', path: '/src/components/Input.tsx' },
        ],
      },
      {
        id: '5',
        name: 'App.tsx',
        type: 'file',
        language: 'typescript',
        path: '/src/App.tsx',
      },
      {
        id: '6',
        name: 'main.tsx',
        type: 'file',
        language: 'typescript',
        path: '/src/main.tsx',
      },
    ],
  },
  {
    id: '7',
    name: 'package.json',
    type: 'file',
    language: 'json',
    path: '/package.json',
  },
  {
    id: '8',
    name: 'tsconfig.json',
    type: 'file',
    language: 'json',
    path: '/tsconfig.json',
  },
]

function FileTreeNode({ 
  item, 
  depth = 0, 
  onFileSelect 
}: { 
  item: FileTreeItem
  depth?: number
  onFileSelect: (item: FileTreeItem) => void
}) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  
  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect(item)
    }
  }
  
  const getIcon = () => {
    if (item.type === 'folder') {
      return isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
    }
    return <FileCode className="h-4 w-4 text-blue-400" />
  }
  
  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors',
          item.type === 'file' && 'hover:bg-accent/50'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {getIcon()}
        <span className="text-sm truncate">{item.name}</span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({ onFileSelect }: { onFileSelect: (item: FileTreeItem) => void }) {
  return (
    <div className="py-2">
      {sampleFiles.map((item) => (
        <FileTreeNode
          key={item.id}
          item={item}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  )
}
