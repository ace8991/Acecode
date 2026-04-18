import React from 'react'
import { User, Bot, Copy, Check, Paperclip, Image as ImageIcon, FileText, File } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import { Attachment } from '@/store/appStore'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  attachments?: Attachment[]
}

interface ChatMessageProps {
  message: Message
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

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false)
  
  const isUser = message.role === 'user'
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className={cn(
      'group flex gap-4 p-4 rounded-lg transition-colors',
      isUser ? 'bg-primary/10' : 'bg-muted/30'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
      )}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        </div>
        
        {/* Display attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-border"
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
              </div>
            ))}
          </div>
        )}
        
        {!isUser && (
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
