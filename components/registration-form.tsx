"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { submitForm, type SubmitState } from "@/app/actions/submit"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2, User, Mail, Smartphone } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black italic uppercase tracking-tight text-lg h-16 rounded-2xl border-b-4 border-white/20 transition-all shadow-[0_15px_40px_rgba(100,50,250,0.3)] hover:shadow-[0_20px_50px_rgba(100,50,250,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:translate-y-1 active:border-b-0"
    >
      {pending ? "Envoi en cours..." : "Rejoindre l'Elite"}
    </button>
  )
}

export function RegistrationForm() {
  const [state, formAction] = useActionState<SubmitState, FormData>(submitForm, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state && !state.ok) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-widest text-white/50 ml-1">
            Prénom
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
            <Input 
              id="firstName" 
              name="firstName" 
              placeholder="Koffi" 
              required 
              className="bg-white/5 border-white/10 h-11 pl-9 rounded-lg focus:border-purple-500 transition-all text-sm text-white placeholder:text-white/10"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName" className="font-bold text-[10px] uppercase tracking-widest text-white/50 ml-1">
            Nom
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
            <Input 
              id="lastName" 
              name="lastName" 
              placeholder="Hounkpatin" 
              required 
              className="bg-white/5 border-white/10 h-11 pl-9 rounded-lg focus:border-purple-500 transition-all text-sm text-white placeholder:text-white/10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest text-white/50 ml-1">
          Adresse email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="koffi@exemple.com" 
            required 
            className="bg-white/5 border-white/10 h-11 pl-9 rounded-lg focus:border-purple-500 transition-all text-sm text-white placeholder:text-white/10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp" className="font-bold text-[10px] uppercase tracking-widest text-white/50 ml-1">
          WhatsApp
        </Label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
          <Input 
            id="whatsapp" 
            name="whatsapp" 
            type="tel" 
            placeholder="+229 01 00..." 
            required 
            className="bg-white/5 border-white/10 h-11 pl-9 rounded-lg focus:border-purple-500 transition-all text-sm text-white placeholder:text-white/10"
          />
        </div>
      </div>

      {state?.ok && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] text-emerald-400 font-bold italic">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
