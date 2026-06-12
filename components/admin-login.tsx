"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login, type LoginState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Connexion..." : "Se connecter"}
    </Button>
  )
}

export function AdminLogin() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null)

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-5 w-5 text-secondary-foreground" />
          </div>
          <CardTitle>Espace administrateur</CardTitle>
          <CardDescription>Entrez le mot de passe pour accéder aux inscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required autoFocus />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
