import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string) {
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
    return null
  }

  return data
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

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
            <Image src={article.image_url || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
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
