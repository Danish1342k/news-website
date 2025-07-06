import { supabase } from "./supabase"

// Admin emails - add more emails here as needed
const ADMIN_EMAILS = ["admin@example.com", "danish@gmail.com"]

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function isAdmin(userId?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return false

  return ADMIN_EMAILS.includes(user.email)
}
