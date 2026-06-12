"use client"

import { useState } from "react"
import { deleteSubmission, updateSubmission } from "@/app/actions/submissions"
import type { Submission } from "@/lib/db"
import { CopyColumnButton } from "./copy-column-button"
import { Trash2, Edit2, Check, X, Smartphone, Mail, User } from "lucide-react"
import { toast } from "sonner"

export function SubmissionsManager({ submissions }: { submissions: Submission[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer définitivement cet inscrit ?")) {
      await deleteSubmission(id)
      toast.success("Inscrit supprimé")
    }
  }

  return (
    <div className="glass-card overflow-hidden border border-white/5 flex flex-col">
      {submissions.length === 0 ? (
        <p className="p-10 text-center text-white/30 italic text-sm">Aucun inscrit.</p>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Prénom</span>
                    <CopyColumnButton label="P" values={submissions.map((s) => s.first_name)} />
                  </div>
                </th>
                <th className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Nom</span>
                    <CopyColumnButton label="N" values={submissions.map((s) => s.last_name)} />
                  </div>
                </th>
                <th className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">WhatsApp</span>
                    <CopyColumnButton label="W" values={submissions.map((s) => s.whatsapp)} />
                  </div>
                </th>
                <th className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Email</span>
                    <CopyColumnButton label="E" values={submissions.map((s) => s.email)} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((s) => (
                <EditableRow 
                  key={s.id} 
                  submission={s} 
                  isEditing={editingId === s.id}
                  onEdit={() => setEditingId(s.id)}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => handleDelete(s.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EditableRow({ 
  submission, 
  isEditing, 
  onEdit, 
  onCancel, 
  onDelete 
}: { 
  submission: Submission
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await updateSubmission(submission.id, formData)
    setLoading(false)
    onCancel()
    toast.success("Informations mises à jour")
  }

  if (isEditing) {
    return (
      <tr className="bg-purple-500/5">
        <td colSpan={5} className="px-4 py-3">
          <form onSubmit={handleUpdate} className="grid grid-cols-5 gap-3 items-center">
            <input 
              name="firstName" 
              defaultValue={submission.first_name} 
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-purple-500" 
              required
            />
            <input 
              name="lastName" 
              defaultValue={submission.last_name} 
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-purple-500" 
              required
            />
            <input 
              name="whatsapp" 
              defaultValue={submission.whatsapp} 
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-purple-500" 
              required
            />
            <input 
              name="email" 
              defaultValue={submission.email} 
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-purple-500" 
              required
            />
            <div className="flex items-center gap-2">
              <button 
                type="submit" 
                disabled={loading}
                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button 
                type="button" 
                onClick={onCancel}
                className="p-1.5 bg-white/5 text-white/50 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-white/[0.01] transition-colors group">
      <td className="px-4 py-3 text-white font-bold text-xs">{submission.first_name}</td>
      <td className="px-4 py-3 text-white font-bold text-xs">{submission.last_name}</td>
      <td className="px-4 py-3">
        <a
          href={`https://wa.me/${submission.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-400 font-bold text-xs flex items-center gap-1"
        >
          <Smartphone className="h-3 w-3" /> {submission.whatsapp.slice(0, 12)}
        </a>
      </td>
      <td className="px-4 py-3">
        <a href={`mailto:${submission.email}`} className="text-purple-400 text-[10px] font-medium truncate max-w-[120px] block">
          {submission.email}
        </a>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="p-1.5 bg-white/5 text-white/50 rounded hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 bg-rose-500/10 text-rose-500/50 rounded hover:bg-rose-500/20 hover:text-rose-500 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </td>
    </tr>
  )
}
