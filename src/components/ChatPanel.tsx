import React, { useRef, useEffect, useState } from 'react'
import { Send, Sparkles, Trash2, Paperclip, X, Image as ImageIcon, FileText, File } from 'lucide-react'
import { useAppStore, Attachment } from '@/store/appStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { ChatMessage } from './ChatMessage'
import { ScrollArea } from './ui/ScrollArea'

export function ChatPanel() {
  const { messages, addMessage, clearMessages, isProcessing, setIsProcessing } = useAppStore()
  const [inputValue, setInputValue] = React.useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    const newAttachments: Attachment[] = files.map(file => {
      const url = URL.createObjectURL(file)
      const type: Attachment['type'] = file.type.startsWith('image/') 
        ? 'image' 
        : file.type.includes('pdf') || file.type.includes('text') || file.type.includes('document')
          ? 'document'
          : 'other'
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        url,
        size: file.size,
        mimeType: file.type,
      }
    })
    
    setAttachments(prev => [...prev, ...newAttachments])
    e.target.value = ''
  }
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let size = bytes
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024
      i++
    }
    return `${size.toFixed(1)} ${units[i]}`
  }
  
  const getAttachmentIcon = (type: Attachment['type'], mimeType: string) => {
    if (type === 'image') return <ImageIcon className="w-4 h-4" />
    if (mimeType.includes('pdf')) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputValue.trim() && attachments.length === 0) || isProcessing) return
    
    let contentText = inputValue.trim()
    
    // Add attachment info to message content
    if (attachments.length > 0) {
      const attachmentList = attachments.map(a => `- ${a.name} (${formatFileSize(a.size)})`).join('\n')
      contentText = contentText 
        ? `${contentText}\n\n📎 Attachments:\n${attachmentList}`
        : `📎 Attachments:\n${attachmentList}`
    }
    
    // Add user message with attachments
    addMessage({
      role: 'user',
      content: contentText,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    })
    
    setInputValue('')
    setAttachments([])
    setIsProcessing(true)
    
    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "I've analyzed your code and found several optimization opportunities. Here's what I recommend:\n\n1. Consider using React.memo for components that don't change often\n2. Implement proper error boundaries\n3. Add TypeScript strict mode for better type safety\n\nWould you like me to implement these changes?",
        "Great question! Here's how you can improve this implementation:\n\n```typescript\nconst optimizedFunction = useCallback(() => {\n  // Your optimized code here\n}, [dependencies])\n```\n\nThis approach ensures better performance and prevents unnecessary re-renders.",
        "I've reviewed your request. Here's my suggestion:\n\n- Use custom hooks for reusable logic\n- Implement proper state management with Zustand\n- Add comprehensive error handling\n\nLet me know if you'd like me to generate the complete implementation!",
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      addMessage({
        role: 'assistant',
        content: randomResponse,
      })
      
      setIsProcessing(false)
    }, 1500)
  }
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearMessages}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">How can I help you today?</h3>
              <p className="text-sm max-w-md mx-auto">
                Ask me anything about your code, request features, debug issues, 
                or get suggestions for improvements.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {isProcessing && (
            <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border group"
              >
                <div className="text-muted-foreground">
                  {getAttachmentIcon(attachment.type, attachment.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate max-w-[150px]">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                {attachment.type === 'image' && (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html,.xml,.yml,.yaml"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="shrink-0"
            title="Attach files (images, documents, etc.)"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about your code... (attach images, PDFs, documents)"
            disabled={isProcessing}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" disabled={(!inputValue.trim() && attachments.length === 0) || isProcessing}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
