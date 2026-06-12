"use server"

import { sql } from "@/lib/db"
import { isAuthenticated } from "./auth"
import { revalidatePath } from "next/cache"

export type SignalState = {
  ok: boolean
  message: string
} | null

// --- Validation Helpers ---
function isValidNumber(val: string) {
  // Allows integers and decimals
  return /^[\d.]+$/.test(val) && !isNaN(parseFloat(val))
}

export async function createSignal(_prev: SignalState, formData: FormData): Promise<SignalState> {
  if (!(await isAuthenticated())) {
    return { ok: false, message: "Non autorisé" }
  }

  // 1. Sanitize
  const pair = String(formData.get("pair") || "").trim().toUpperCase()
  const type = String(formData.get("type") || "").trim().toUpperCase()
  const entry_price = String(formData.get("entry_price") || "").trim()
  const tp_price = String(formData.get("tp_price") || "").trim()
  const sl_price = String(formData.get("sl_price") || "").trim()
  const message = String(formData.get("message") || "").trim()

  // 2. Strict Validation
  if (!pair || pair.length > 20 || !/^[A-Z0-9/-]+$/.test(pair)) {
    return { ok: false, message: "Format de paire invalide (ex: BTC/USD)." }
  }

  if (type !== "BUY" && type !== "SELL") {
    return { ok: false, message: "Le type doit être ACHAT ou VENTE." }
  }

  if (!isValidNumber(entry_price) || !isValidNumber(tp_price) || !isValidNumber(sl_price)) {
    return { ok: false, message: "Les prix doivent être des nombres valides." }
  }

  if (message && message.length > 500) {
    return { ok: false, message: "Le message est trop long (max 500 caractères)." }
  }

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS signals (
        id SERIAL PRIMARY KEY,
        pair TEXT NOT NULL,
        type TEXT NOT NULL,
        entry_price TEXT NOT NULL,
        tp_price TEXT NOT NULL,
        sl_price TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Secure parameterized query
    await sql`
      INSERT INTO signals (pair, type, entry_price, tp_price, sl_price, message)
      VALUES (${pair}, ${type}, ${entry_price}, ${tp_price}, ${sl_price}, ${message})
    `

    revalidatePath("/admin")
    return { ok: true, message: "Signal publié avec succès !" }
  } catch (error) {
    console.error("Create signal error:", error)
    return { ok: false, message: "Erreur serveur lors de la publication." }
  }
}

export async function deleteSignal(id: number) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized")
  }

  try {
    await sql`DELETE FROM signals WHERE id = ${id}`
    revalidatePath("/admin")
  } catch (error) {
    console.error("Delete signal error:", error)
  }
}

export async function updateSignal(id: number, formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized")
  }

  const pair = String(formData.get("pair") || "").trim().toUpperCase()
  const type = String(formData.get("type") || "").trim().toUpperCase()
  const entry_price = String(formData.get("entry_price") || "").trim()
  const tp_price = String(formData.get("tp_price") || "").trim()
  const sl_price = String(formData.get("sl_price") || "").trim()

  // Strict Validation
  if (!pair || pair.length > 20 || !/^[A-Z0-9/-]+$/.test(pair)) {
    throw new Error("Paire invalide")
  }
  if (type !== "BUY" && type !== "SELL") {
    throw new Error("Type invalide")
  }
  if (!isValidNumber(entry_price) || !isValidNumber(tp_price) || !isValidNumber(sl_price)) {
    throw new Error("Prix invalides")
  }

  try {
    await sql`
      UPDATE signals 
      SET pair = ${pair}, type = ${type}, entry_price = ${entry_price}, tp_price = ${tp_price}, sl_price = ${sl_price}
      WHERE id = ${id}
    `
    revalidatePath("/admin")
  } catch (error) {
    console.error("Update signal error:", error)
    throw new Error("Erreur serveur")
  }
}

export async function updateSignalStatus(id: number, status: "ACTIVE" | "CLOSED") {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized")
  }

  if (status !== "ACTIVE" && status !== "CLOSED") {
    throw new Error("Statut invalide")
  }

  try {
    await sql`UPDATE signals SET status = ${status} WHERE id = ${id}`
    revalidatePath("/admin")
  } catch (error) {
    console.error("Update status error:", error)
  }
}
