import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are available
const isConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create Supabase client or mock client
let supabase: any

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    supabase = createMockClient()
  }
} else {
  console.warn("Supabase environment variables not found. Using mock client.")
  supabase = createMockClient()
}

function createMockClient() {
  const createMockQuery = () => ({
    select: (columns?: string) => createMockQuery(),
    eq: (column: string, value: any) => createMockQuery(),
    neq: (column: string, value: any) => createMockQuery(),
    order: (column: string, options?: any) => createMockQuery(),
    limit: (count: number) => createMockQuery(),
    single: () => Promise.resolve({ 
      data: null, 
      error: { message: "Supabase not configured" } 
    }),
    then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
    insert: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: "Supabase not configured" } 
    }),
    update: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: "Supabase not configured" } 
    }),
    delete: () => Promise.resolve({ 
      data: null, 
      error: { message: "Supabase not configured" } 
    })
  })

  return {
    from: (table: string) => createMockQuery(),
    auth: {
      signInWithPassword: (credentials: any) => Promise.resolve({ 
        data: null, 
        error: { message: "Supabase not configured" } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ 
        data: { user: null }, 
        error: null 
      })
    }
  }
}

// Export configuration status
export const isSupabaseConfigured = isConfigured

export { supabase }

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
