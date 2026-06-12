"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyColumnButton({ values, label }: { values: string[]; label: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const text = values.join("\n")
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-white/50 hover:bg-purple-500/20 hover:text-purple-400 transition-all cursor-pointer"
      title={`Copier tous les ${label}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}
