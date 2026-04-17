import React, { useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { ChatMessage } from './ChatMessage'
import { ScrollArea } from './ui/ScrollArea'

export function ChatPanel() {
  const { messages, addMessage, clearMessages, isProcessing, setIsProcessing } = useAppStore()
  const [inputValue, setInputValue] = React.useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isProcessing) return
    
    // Add user message
    addMessage({
      role: 'user',
      content: inputValue.trim(),
    })
    
    setInputValue('')
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
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about your code..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={!inputValue.trim() || isProcessing}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
