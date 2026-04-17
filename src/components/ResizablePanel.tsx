import React, { createContext, useContext, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ResizableContextType {
  direction: 'horizontal' | 'vertical'
}

const ResizableContext = createContext<ResizableContextType>({ direction: 'horizontal' })

interface ResizablePanelGroupProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function ResizablePanelGroup({ 
  children, 
  direction = 'horizontal',
  className 
}: ResizablePanelGroupProps) {
  return (
    <ResizableContext.Provider value={{ direction }}>
      <div 
        className={cn(
          'flex h-full w-full',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  )
}

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
}

export function ResizablePanel({ 
  children, 
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className 
}: ResizablePanelProps) {
  const { direction } = useContext(ResizableContext)
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current?.parentElement) return
      
      const parent = panelRef.current.parentElement
      const rect = parent.getBoundingClientRect()
      
      let newSize: number
      if (direction === 'horizontal') {
        newSize = ((e.clientX - rect.left) / rect.width) * 100
      } else {
        newSize = ((e.clientY - rect.top) / rect.height) * 100
      }
      
      newSize = Math.max(minSize, Math.min(maxSize, newSize))
      setSize(newSize)
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, direction, minSize, maxSize])
  
  return (
    <div
      ref={panelRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}%`,
      }}
    >
      {children}
    </div>
  )
}

interface ResizableHandleProps {
  withHandle?: boolean
  className?: string
}

export function ResizableHandle({ withHandle = true, className }: ResizableHandleProps) {
  const { direction } = useContext(ResizableContext)
  const [isHovered, setIsHovered] = useState(false)
  const parentRef = React.useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const el = parentRef.current?.parentElement
    if (el) {
      const firstChild = el.firstElementChild as HTMLElement
      if (firstChild) {
        // Store reference to previous sibling for resize logic
        ;(firstChild as any)._nextSibling = el
      }
    }
  }, [])
  
  return (
    <div
      ref={parentRef}
      className={cn(
        'relative z-10 flex-shrink-0',
        direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
        isHovered && 'bg-primary/50',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        e.preventDefault()
        const event = new MouseEvent('mousedown', e)
        document.dispatchEvent(event)
      }}
    >
      {withHandle && (
        <div 
          className={cn(
            'absolute bg-border rounded-full transition-colors',
            direction === 'horizontal' 
              ? 'w-1 h-8 -left-0 top-1/2 -translate-y-1/2' 
              : 'h-1 w-8 -top-0 left-1/2 -translate-x-1/2'
          )}
        />
      )}
    </div>
  )
}
