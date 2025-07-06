import { supabase } from "@/lib/supabase"
import { ArticleCard } from "@/components/article-card"
import { NewsletterSignup } from "@/components/newsletter-signup"

async function getFeaturedArticle() {
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
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching featured article:", error)
    return null
  }

  return data
}

async function getLatestArticles() {
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
    .eq("featured", false)
    .order("published_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const [featuredArticle, latestArticles] = await Promise.all([getFeaturedArticle(), getLatestArticles()])

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Featured Article */}
      {featuredArticle && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest News
          </h2>
          <ArticleCard article={featuredArticle} featured />
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
        <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article, index) => (
            <div
              key={article.id}
              className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-500">
        <NewsletterSignup />
      </section>
    </div>
  )
}
