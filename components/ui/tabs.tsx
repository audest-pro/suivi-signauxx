"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

export function Tabs({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  children, 
  className 
}: { 
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  const [value, setValue] = React.useState(controlledValue || defaultValue || "")
  
  const activeValue = controlledValue !== undefined ? controlledValue : value
  const handleValueChange = React.useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setValue(newValue)
    }
    onValueChange?.(newValue)
  }, [controlledValue, onValueChange])

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center p-1", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
  const context = React.useContext(TabsContext)
  if (!context) return null
  
  const isActive = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
  const context = React.useContext(TabsContext)
  if (!context || context.value !== value) return null

  return (
    <div role="tabpanel" className={cn("mt-2 focus-visible:outline-none", className)}>
      {children}
    </div>
  )
}
