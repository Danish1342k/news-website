import { supabase } from "@/lib/supabase"
import { ArticleCard } from "@/components/article-card"
// import { NewsletterSignup } from "@/components/newsletter-signup"

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
    .order("created_at", { ascending: false }) // Order by creation date, newest first
    .limit(7)

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const allArticles = await getLatestArticles()

  // Get the very latest article for the featured section
  const latestArticle = allArticles[0]

  // Get the remaining articles for the recent section
  const recentArticles = allArticles.slice(1, 7)

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Latest News - Always show the newest article */}
      {latestArticle && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest News
          </h2>
          <ArticleCard article={latestArticle} featured />
        </section>
      )}

      {/* Recent Articles - Show all other articles in chronological order */}
      {recentArticles.length > 0 && (
        <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article, index) => (
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
      )}

      {/* Newsletter Signup */}
      {/* <section className="animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-500">
        <NewsletterSignup />
      </section> */}
    </div>
  )
}
