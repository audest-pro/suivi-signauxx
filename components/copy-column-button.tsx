"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

export function CopyColumnButton({ label, values }: { label: string; values: string[] }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (values.length === 0) {
      toast.error("Aucune donnée à copier")
      return
    }
    try {
      await navigator.clipboard.writeText(values.join("\n"))
      setCopied(true)
      toast.success(`${values.length} ${label.toLowerCase()} copié${values.length > 1 ? "s" : ""}`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Impossible de copier")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={handleCopy}
      className="ml-1 h-6 w-6 align-middle text-muted-foreground hover:text-foreground"
      aria-label={`Copier tous les ${label.toLowerCase()}`}
      title={`Copier tous les ${label.toLowerCase()}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  )
}
