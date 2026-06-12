"use server"

import { sql } from "@/lib/db"
import { isAuthenticated } from "./auth"
import { revalidatePath } from "next/cache"

// --- Validation Helpers ---

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateWhatsApp(phone: string) {
  // Simple check for digits and optional +
  return /^[\d+ ]{8,20}$/.test(phone)
}

// --- Actions ---

export async function deleteSubmission(id: number) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized")
  }

  try {
    // Sanitized by neon parameterization
    await sql`DELETE FROM submissions WHERE id = ${id}`
    revalidatePath("/admin")
  } catch (error) {
    console.error("Delete error:", error)
  }
}

export async function updateSubmission(id: number, formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized")
  }

  const firstName = String(formData.get("firstName") || "").trim()
  const lastName = String(formData.get("lastName") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const whatsapp = String(formData.get("whatsapp") || "").trim()

  // Strict Validation
  if (!firstName || !lastName || firstName.length > 50 || lastName.length > 50) {
    throw new Error("Nom ou prénom invalide")
  }

  if (!validateEmail(email)) {
    throw new Error("Email invalide")
  }

  if (!validateWhatsApp(whatsapp)) {
    throw new Error("WhatsApp invalide")
  }

  try {
    // Neon neon() automatically parameterizes these values, preventing SQL injection
    await sql`
      UPDATE submissions 
      SET first_name = ${firstName}, last_name = ${lastName}, email = ${email}, whatsapp = ${whatsapp}
      WHERE id = ${id}
    `
    revalidatePath("/admin")
  } catch (error) {
    console.error("Update error:", error)
    throw new Error("Erreur base de données")
  }
}
