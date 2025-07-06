import { notFound } from "next/navigation"
import { ArticleCard } from "@/components/article-card"
import { supabase } from "@/lib/supabase"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategoryWithArticles(slug: string) {
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (categoryError) {
    return null
  }

  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("category_id", category.id)
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (articlesError) {
    return { category, articles: [] }
  }

  return { category, articles: articles || [] }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const result = await getCategoryWithArticles(params.slug)

  if (!result) {
    notFound()
  }

  const { category, articles } = result

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && <p className="text-lg text-muted-foreground">{category.description}</p>}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No articles found in this category yet.</p>
        </div>
      )}
    </div>
  )
}
