import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  category_id: string | null
  published: boolean
  featured: boolean
  image_url: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  categories?: Category
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  subscribed_at: string
}
