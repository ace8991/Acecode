import React from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { useAppStore } from '@/store/appStore'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

export function CodeEditor() {
  const { files, activeFileId, setActiveFile, closeFile, updateFileContent } = useAppStore()
  
  const activeFile = files.find(f => f.id === activeFileId)
  
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.onDidChangeModelContent(() => {
      if (activeFileId) {
        updateFileContent(activeFileId, editor.getValue())
      }
    })
    
    // Configure Monaco for better performance
    monaco.editor.setTheme('vs-dark')
  }
  
  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No file open</p>
          <p className="text-sm">Select a file from the sidebar or create a new one</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* File tabs */}
      <div className="flex items-center border-b border-border bg-muted/30 overflow-x-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              'group flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-r border-border transition-colors',
              activeFileId === file.id 
                ? 'bg-background text-foreground' 
                : 'text-muted-foreground hover:bg-muted/50'
            )}
            onClick={() => setActiveFile(file.id)}
          >
            <span>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeFile(file.id)
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-accent rounded p-0.5 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={activeFile.language === 'typescript' ? 'typescript' : 'json'}
          value={activeFile.content}
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>
    </div>
  )
}
