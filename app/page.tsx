import { supabase } from "@/lib/supabase"
// import { ArticleCard } from "@/components/article-card"
// import { NewsletterSignup } from "@/components/newsletter-signup"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User } from 'lucide-react'

async function getAllPublishedArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const allArticles = await getAllPublishedArticles()

  // Get the latest article (most recent by date)
  const latestArticle = allArticles[0] || null

  // Get all other articles for Recent Articles section
  const recentArticles = allArticles.slice(1)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Latest News Section */}
      {latestArticle && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
          <h2 className="text-3xl font-bold mb-6 text-primary">Latest News</h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={latestArticle.image_url || "/placeholder.svg?height=400&width=600&query=news"}
                  alt={latestArticle.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {latestArticle.categories && (
                  <Badge variant="secondary" className="w-fit mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {latestArticle.categories.name}
                  </Badge>
                )}
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight hover:text-primary transition-colors duration-300">
                  {latestArticle.title}
                </h3>
                
                {latestArticle.excerpt && (
                  <p className="text-muted-foreground mb-6 line-clamp-3 text-base">
                    {latestArticle.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{latestArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(latestArticle.published_at || latestArticle.created_at)}</span>
                  </div>
                </div>
                
                <Link href={`/article/${latestArticle.slug}`}>
                  <Button className="w-fit bg-blue-600 hover:bg-blue-700 text-white">
                    Read Full Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles Section */}
      {recentArticles.length > 0 && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article, index) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image_url || "/placeholder.svg?height=200&width=400&query=news"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {article.categories && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-white/90 text-gray-800 shadow-md"
                    >
                      {article.categories.name}
                    </Badge>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                  </div>
                  
                  <Link href={`/article/${article.slug}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup
      <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-500">
        <NewsletterSignup />
      </section> */}

      {/* Empty State */}
      {allArticles.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
          <p className="text-muted-foreground">Check back later for the latest news updates.</p>
        </div>
      )}
    </div>
  )
}
