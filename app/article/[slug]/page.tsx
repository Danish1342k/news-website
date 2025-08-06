import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase, isSupabaseConfigured } from "@/lib/supabase" // Corrected import
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

async function getArticle(slug: string) {
  // Return null if Supabase is not configured
  if (!isSupabaseConfigured) {
    console.log("Supabase not configured, cannot fetch article")
    return null
  }

  try {
    console.log("Fetching article with slug:", slug)
    
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Error fetching article:", error)
      return null
    }

    console.log("Found article:", data?.title)
    return data
  } catch (error) {
    console.error("Exception fetching article:", error)
    return null
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  // Show configuration message if Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
              Database Not Configured
            </h1>
            <p className="text-yellow-700 dark:text-yellow-300 mb-6">
              Please configure your Supabase environment variables to view articles.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {article.categories && (
            <Badge variant="secondary" className="mb-4">
              {article.categories.name}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image 
              src={article.image_url || "/placeholder.svg"} 
              alt={article.title} 
              fill 
              className="object-cover" 
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {article.content.split("\n\n").map((paragraph: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
            <p key={index} className="mb-4 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            {article.categories && (
              <Link href={`/category/${article.categories.slug}`}>
                <Button variant="outline">More in {article.categories.name}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
