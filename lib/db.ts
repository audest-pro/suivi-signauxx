import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type Submission = {
  id: number
  first_name: string
  last_name: string
  email: string
  whatsapp: string
  created_at: string
}

export type Signal = {
  id: number
  pair: string
  type: "BUY" | "SELL"
  entry_price: string
  tp_price: string
  sl_price: string
  status: "ACTIVE" | "CLOSED"
  message?: string
  created_at: string
}
