"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login, type LoginState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black italic uppercase tracking-tight text-lg h-14 rounded-xl border-b-4 border-white/20 transition-all shadow-[0_10px_30px_rgba(100,50,250,0.3)] hover:shadow-[0_15px_40px_rgba(100,50,250,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:translate-y-1 active:border-b-0"
    >
      {pending ? "Connexion..." : "Se connecter"}
    </button>
  )
}

export function AdminLogin() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null)

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-sm relative z-10">
        <div className="glass-card p-8 border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-xl">
              <Lock className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter gradient-text">
              Espace Admin
            </h1>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Accès réservé aux administrateurs.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" title="Mot de passe" className="font-bold text-xs uppercase tracking-widest text-white/70 ml-1">
                Mot de passe
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                autoFocus 
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-purple-500 transition-all text-white placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
            
            {state?.error && (
              <p className="text-sm text-rose-500 font-bold italic animate-pulse">
                {state.error}
              </p>
            )}
            
            <LoginButton />
          </form>
        </div>
      </div>
    </main>
  )
}
