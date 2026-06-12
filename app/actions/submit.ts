"use server"

import { sql } from "@/lib/db"

export type SubmitState = {
  ok: boolean
  message: string
} | null

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateWhatsApp(phone: string) {
  return /^[\d+ ]{8,20}$/.test(phone)
}

export async function submitForm(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  // 1. Extract & Sanitize
  const firstName = String(formData.get("firstName") || "").trim()
  const lastName = String(formData.get("lastName") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const whatsapp = String(formData.get("whatsapp") || "").trim()

  // 2. Strict Validation
  if (!firstName || !lastName || firstName.length > 50 || lastName.length > 50) {
    return { ok: false, message: "Nom ou prénom invalide (max 50 caractères)." }
  }

  if (!validateEmail(email) || email.length > 100) {
    return { ok: false, message: "Adresse email invalide." }
  }

  if (!validateWhatsApp(whatsapp)) {
    return { ok: false, message: "Numéro WhatsApp invalide." }
  }

  try {
    // 3. Rate limiting check (basic IP-less check for demonstration, 
    // ideally rely on Vercel Edge Middleware for real rate limiting)
    // Here we check if this email already submitted recently to prevent spam
    const recent = await sql`
      SELECT id FROM submissions 
      WHERE email = ${email} AND created_at > NOW() - INTERVAL '5 minutes'
    `
    if (recent.length > 0) {
      return { ok: false, message: "Veuillez patienter avant de soumettre à nouveau." }
    }

    // 4. Secure DB Insert (Parameterization prevents SQLi)
    await sql`
      INSERT INTO submissions (first_name, last_name, email, whatsapp)
      VALUES (${firstName}, ${lastName}, ${email}, ${whatsapp})
    `

    return { 
      ok: true, 
      message: "Félicitations ! Votre inscription est confirmée." 
    }
  } catch (error) {
    console.error("Submission error:", error)
    return { ok: false, message: "Une erreur est survenue. Veuillez réessayer plus tard." }
  }
}
