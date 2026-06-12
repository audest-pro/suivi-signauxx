"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type SubmitState = {
  ok: boolean
  message: string
} | null

export async function submitForm(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const firstName = String(formData.get("firstName") || "").trim()
  const lastName = String(formData.get("lastName") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const whatsapp = String(formData.get("whatsapp") || "").trim()

  if (!firstName || !lastName || !email || !whatsapp) {
    return { ok: false, message: "Veuillez remplir tous les champs." }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { ok: false, message: "Veuillez saisir une adresse email valide." }
  }

  try {
    await sql`
      INSERT INTO submissions (first_name, last_name, email, whatsapp)
      VALUES (${firstName}, ${lastName}, ${email}, ${whatsapp})
    `
    revalidatePath("/admin")
    return { ok: true, message: "Merci ! Vos informations ont bien été enregistrées." }
  } catch (error) {
    console.log("[v0] Erreur d'insertion:", error)
    return { ok: false, message: "Une erreur est survenue. Veuillez réessayer." }
  }
}
