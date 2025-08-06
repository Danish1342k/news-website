import { supabase, isSupabaseConfigured } from "@/lib/supabase" // Corrected import
// import { NewsletterSignup } from "@/components/newsletter-signup"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, AlertCircle, Database } from 'lucide-react'

async function getAllPublishedArticles() {
  try {
    // Return empty array if not configured
    if (!isSupabaseConfigured) {
      console.log("Supabase not configured, returning empty articles array")
      return []
    }

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

    if (error) {
      console.error("Error fetching articles:", error)
      return []
    }

    // Sort articles by date (published_at or created_at as fallback)
    const sortedArticles = (data || []).sort((a: any, b: any) => {
      const dateA = new Date(a.published_at || a.created_at).getTime()
      const dateB = new Date(b.published_at || b.created_at).getTime()
      return dateB - dateA // Most recent first
    })

    // Debug: Log article information
    console.log("Fetched articles:", sortedArticles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      published: a.published
    })))

    return sortedArticles
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return []
  }
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

  // Show environment configuration message if Supabase is not configured
  const showConfigMessage = !isSupabaseConfigured

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Configuration Message */}
      {showConfigMessage && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                🔧 Setup Required
              </h2>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                Your news website is almost ready! Please configure your database connection to start publishing articles.
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  📋 Quick Setup Steps:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Create a <strong>Supabase project</strong> at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
                  <li>Copy your <strong>Project URL</strong> and <strong>Anon Key</strong></li>
                  <li>Create a <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env.local</code> file in your project root</li>
                  <li>Add your Supabase credentials (see example below)</li>
                  <li>Run the database setup scripts in Supabase SQL Editor</li>
                </ol>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-2">📄 .env.local file example:</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
              </div>

              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                >
                  🚀 Create Supabase Project
                </a>
                <a 
                  href="/admin/login" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  🔐 Admin Login
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && isSupabaseConfigured && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Debug Info (Development)</h3>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Supabase Status:</strong> ✅ Configured</p>
            <p><strong>Articles Found:</strong> {allArticles.length}</p>
            {allArticles.length > 0 && (
              <div>
                <p><strong>Article Slugs:</strong></p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {allArticles.slice(0, 5).map(article => (
                    <li key={article.id}>
                      <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">
                        /article/{article.slug}
                      </code> - {article.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Content When Not Configured */}
      {showConfigMessage && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
          <h2 className="text-3xl font-bold mb-6 text-primary">📰 Preview: Latest News</h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 opacity-75">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Demo Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Demo News Article"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Demo Content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Technology
                </Badge>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  Your First News Article Will Appear Here
                </h3>
                
                <p className="text-muted-foreground mb-6 line-clamp-3 text-base">
                  Once you configure your database and create your first article, it will be displayed in this featured section. Your readers will see the latest news with beautiful formatting and responsive design.
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>News Editor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date().toISOString())}</span>
                  </div>
                </div>
                
                <Button className="w-fit bg-blue-600 hover:bg-blue-700 text-white" disabled>
                  Read Full Story (Demo)
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Newsletter Signup */}
      {/* <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-500">
        <NewsletterSignup />
      </section> */}

      {/* Empty State - Only show if we have proper config but no articles */}
      {allArticles.length === 0 && isSupabaseConfigured && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
          <p className="text-muted-foreground mb-6">Get started by creating your first article in the admin panel.</p>
          <Link href="/admin">
            <Button className="bg-primary hover:bg-primary/90">
              Go to Admin Panel
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
