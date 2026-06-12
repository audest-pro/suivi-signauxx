"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { createSignal, deleteSignal, updateSignalStatus, updateSignal, type SignalState } from "@/app/actions/signals"
import type { Signal } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash2, CheckCircle2, XCircle, TrendingUp, TrendingDown, Clock, Edit2, Check, X } from "lucide-react"

function SignalSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black italic uppercase tracking-tight h-12 rounded-xl border-b-4 border-white/20 transition-all shadow-[0_10px_30px_rgba(100,50,250,0.3)] disabled:opacity-50 cursor-pointer active:translate-y-1 active:border-b-0"
    >
      {pending ? "Publication..." : "Publier le Signal"}
    </button>
  )
}

export function SignalManager({ signals }: { signals: Signal[] }) {
  const [state, formAction] = useActionState<SignalState, FormData>(createSignal, null)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message)
    } else if (state && !state.ok) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire de création */}
      <section className="glass-card p-5 sm:p-8 border border-white/5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 border border-purple-500/30">
            <Plus className="h-4 w-4 text-purple-400" />
          </div>
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            Nouveau Signal
          </h2>
        </div>

        <form action={formAction} className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Paire</Label>
            <Input name="pair" placeholder="BTC/USD" required className="bg-white/5 border-white/10 rounded-lg h-10 text-sm focus:border-purple-500" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Type</Label>
            <select name="type" required className="bg-white/5 border border-white/10 rounded-lg h-10 text-sm focus:border-purple-500 text-white px-2 outline-none">
              <option value="BUY" className="bg-zinc-900 text-white">ACHAT</option>
              <option value="SELL" className="bg-zinc-900 text-white">VENTE</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Entrée</Label>
            <Input name="entry_price" placeholder="65000" required className="bg-white/5 border-white/10 rounded-lg h-10 text-sm focus:border-purple-500" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-3">
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">TP</Label>
              <Input name="tp_price" placeholder="68000" required className="bg-white/5 border-white/10 rounded-lg h-10 text-sm focus:border-emerald-500" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">SL</Label>
              <Input name="sl_price" placeholder="64000" required className="bg-white/5 border-white/10 rounded-lg h-10 text-sm focus:border-rose-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1 md:col-span-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Note</Label>
            <Input name="message" placeholder="Optionnel..." className="bg-white/5 border-white/10 rounded-lg h-10 text-sm focus:border-purple-500" />
          </div>
          <div className="md:col-span-3 mt-1">
            <SignalSubmitButton />
          </div>
        </form>
      </section>

      {/* Liste des signaux */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30">
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            Historique
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {signals.length === 0 ? (
            <p className="text-white/30 italic col-span-full text-center py-6 text-sm">Aucun signal.</p>
          ) : (
            signals.map((signal) => (
              <EditableSignal 
                key={signal.id} 
                signal={signal} 
                isEditing={editingId === signal.id}
                onEdit={() => setEditingId(signal.id)}
                onCancel={() => setEditingId(null)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function EditableSignal({ signal, isEditing, onEdit, onCancel }: { signal: Signal, isEditing: boolean, onEdit: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await updateSignal(signal.id, formData)
    setLoading(false)
    onCancel()
    toast.success("Signal mis à jour")
  }

  if (isEditing) {
    return (
      <div className="glass-card p-4 border border-purple-500/30 bg-purple-500/5">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Input name="pair" defaultValue={signal.pair} className="h-8 text-[10px] bg-white/10 border-white/10" required />
            <select name="type" defaultValue={signal.type} className="h-8 text-[10px] bg-white/10 border border-white/10 rounded px-1 outline-none text-white">
              <option value="BUY" className="bg-zinc-900 text-white">ACHAT</option>
              <option value="SELL" className="bg-zinc-900 text-white">VENTE</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input name="entry_price" defaultValue={signal.entry_price} className="h-8 text-[10px] bg-white/10 border-white/10" required />
            <Input name="tp_price" defaultValue={signal.tp_price} className="h-8 text-[10px] bg-emerald-500/10 border-emerald-500/20 text-emerald-400" required />
            <Input name="sl_price" defaultValue={signal.sl_price} className="h-8 text-[10px] bg-rose-500/10 border-rose-500/20 text-rose-400" required />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-emerald-500/20 text-emerald-400 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer">
              {loading ? "..." : "Valider"}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-white/5 text-white/50 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer">
              Annuler
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`glass-card p-4 border group transition-all ${signal.status === 'CLOSED' ? 'opacity-50' : 'border-white/10 hover:border-white/20'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {signal.type === 'BUY' ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-400" />
          )}
          <span className="font-black italic text-base text-white uppercase tracking-tighter">
            {signal.pair}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${
            signal.status === 'ACTIVE' 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
          }`}>
            {signal.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-3">
        <div className="flex flex-col">
          <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest">In</span>
          <span className="text-xs font-bold text-white">{signal.entry_price}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-emerald-400/40 uppercase font-bold tracking-widest">TP</span>
          <span className="text-xs font-bold text-emerald-400">{signal.tp_price}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-rose-400/40 uppercase font-bold tracking-widest">SL</span>
          <span className="text-xs font-bold text-rose-400">{signal.sl_price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        {signal.status === 'ACTIVE' ? (
          <button 
            onClick={() => updateSignalStatus(signal.id, 'CLOSED')}
            className="flex-1 text-[9px] font-black uppercase italic bg-zinc-800 text-white py-1.5 rounded-md cursor-pointer"
          >
            Clôturer
          </button>
        ) : (
          <button 
            onClick={() => updateSignalStatus(signal.id, 'ACTIVE')}
            className="flex-1 text-[9px] font-black uppercase italic bg-emerald-900/30 text-emerald-400 py-1.5 rounded-md cursor-pointer"
          >
            Réactiver
          </button>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center bg-white/5 text-white/50 rounded-md hover:text-white cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => {
              if(confirm("Supprimer ?")) deleteSignal(signal.id)
            }}
            className="flex h-7 w-7 items-center justify-center bg-rose-900/20 text-rose-400 rounded-md cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
