"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

const COOKIE_NAME = "admin_session"

function sessionToken() {
  // Token dérivé du mot de passe — change si le mot de passe change.
  return createHash("sha256")
    .update(`admin:${process.env.ADMIN_PASSWORD ?? ""}`)
    .digest("hex")
}

export async function isAuthenticated() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === sessionToken()
}

export type LoginState = { error: string } | null

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") || "")
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return { error: "Le mot de passe admin n'est pas configuré." }
  }
  if (password !== expected) {
    return { error: "Mot de passe incorrect." }
  }

  const store = await cookies()
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect("/admin")
}

export async function logout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  redirect("/admin")
}
