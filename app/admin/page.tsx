"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Users, TrendingUp, Eye, Calendar, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  articles: number
  categories: number
  users: number
  publishedArticles: number
}

interface RecentArticle {
  id: string
  title: string
  published_at: string | null
  created_at: string
  published: boolean
  categories: { name: string } | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ articles: 0, categories: 0, users: 0, publishedArticles: 0 })
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [articlesResult, categoriesResult, usersResult, publishedResult] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact" }),
        supabase.from("categories").select("id", { count: "exact" }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
        supabase.from("articles").select("id", { count: "exact" }).eq("published", true),
      ])

      setStats({
        articles: articlesResult.count || 0,
        categories: categoriesResult.count || 0,
        users: usersResult.count || 0,
        publishedArticles: publishedResult.count || 0,
      })

      // Fetch recent articles with proper join
      const { data: articles, error } = await supabase
        .from("articles")
        .select(`
          id, 
          title, 
          published_at, 
          created_at, 
          published,
          category_id,
          categories!inner (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching articles:", error)

        // Fallback: fetch articles without categories
        const { data: fallbackArticles, error: fallbackError } = await supabase
          .from("articles")
          .select("id, title, published_at, created_at, published")
          .order("created_at", { ascending: false })
          .limit(5)

        if (fallbackError) {
          console.error("Fallback query also failed:", fallbackError)
          setRecentArticles([])
        } else {
          const transformedArticles: RecentArticle[] = (fallbackArticles || []).map((article) => ({
            id: article.id,
            title: article.title,
            published_at: article.published_at,
            created_at: article.created_at,
            published: article.published,
            categories: null,
          }))
          setRecentArticles(transformedArticles)
        }
      } else {
        // Transform the data to match our interface
        const transformedArticles: RecentArticle[] = (articles || []).map((article: any) => ({
          id: article.id,
          title: article.title,
          published_at: article.published_at,
          created_at: article.created_at,
          published: article.published,
          categories:
            article.categories && Array.isArray(article.categories) && article.categories.length > 0
              ? { name: article.categories[0].name }
              : article.categories && !Array.isArray(article.categories)
                ? { name: article.categories.name }
                : null,
        }))

        setRecentArticles(transformedArticles)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Articles",
      value: stats.articles,
      description: "All articles in system",
      icon: FileText,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50",
    },
    {
      title: "Published",
      value: stats.publishedArticles,
      description: "Live on website",
      icon: Eye,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50",
    },
    {
      title: "Categories",
      value: stats.categories,
      description: "Content categories",
      icon: FolderOpen,
      color: "from-emerald-600 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-900/50",
    },
    {
      title: "Subscribers",
      value: stats.users,
      description: "Newsletter subscribers",
      icon: Users,
      color: "from-teal-600 to-emerald-600",
      bgColor: "from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-900/50",
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="animate-in fade-in-50 slide-in-from-top-5 duration-500 mb-4 md:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">Welcome to your news content management system</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className={`overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-0 bg-gradient-to-br ${card.bgColor} group cursor-pointer animate-in fade-in-50 slide-in-from-bottom-5 duration-700`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative p-3 md:p-4">
              <div className="space-y-1">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {card.title}
                </CardTitle>
                <div className="text-xl md:text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {card.value}
                </div>
              </div>
              <div
                className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br ${card.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
              >
                <card.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-900 animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-t-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg md:text-xl text-emerald-700 dark:text-emerald-400">
                Recent Articles
              </CardTitle>
              <CardDescription className="text-sm">The latest articles published on your site</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {recentArticles.map((article, index) => (
              <div
                key={article.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-lg border bg-gradient-to-r from-background to-muted/10 hover:from-muted/20 hover:to-muted/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group animate-in fade-in-50 slide-in-from-left-5 duration-500`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <FileText className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate group-hover:text-primary transition-colors duration-300 text-sm md:text-base">
                      {article.title}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                      {article.categories && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs w-fit">
                          {article.categories.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
                  <div
                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                      article.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {recentArticles.length === 0 && (
            <div className="text-center py-8 md:py-12 animate-in fade-in-50 duration-500">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No articles found</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first article to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-500">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
              <TrendingUp className="h-2 w-2 md:h-3 md:w-3 text-white" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "New Article", description: "Create a new article", href: "/admin/articles/new" },
              { title: "Manage Categories", description: "Organize your content", href: "/admin/categories" },
              { title: "View Subscribers", description: "Check newsletter subscribers", href: "/admin/users" },
            ].map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                className={`block p-3 md:p-4 rounded-lg border bg-gradient-to-br from-background to-muted/10 hover:from-primary/5 hover:to-secondary/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 group animate-in fade-in-50 slide-in-from-bottom-5 duration-500`}
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <h3 className="font-medium group-hover:text-primary transition-colors duration-300 text-sm md:text-base">
                  {action.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{action.description}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
