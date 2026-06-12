"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { submitForm, type SubmitState } from "@/app/actions/submit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? "Envoi en cours..." : "Envoyer"}
    </Button>
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
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" placeholder="Koffi" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" placeholder="Hounkpatin" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Adresse email</Label>
          <Input id="email" name="email" type="email" placeholder="koffi.hounkpatin@exemple.com" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+229 01 97 12 34 56" required />
      </div>

      {state?.ok && (
        <div className="flex items-center gap-2 rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
