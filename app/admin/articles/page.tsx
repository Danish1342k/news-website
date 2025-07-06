"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Filter, FileText, Eye, EyeOff } from "lucide-react"
import { supabase, type Article } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<(Article & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
      fetchArticles()
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Article ${!currentStatus ? "published" : "unpublished"} successfully`,
      })
      fetchArticles()
    } catch (error) {
      console.error("Error updating article:", error)
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && article.published) ||
      (filterStatus === "draft" && !article.published)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground animate-pulse">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in-50 slide-in-from-top-5 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Articles
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your news articles</p>
          </div>
        </div>
        <Link href="/admin/articles/new">
          <Button className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-background to-muted/10 animate-in fade-in-50 slide-in-from-left-5 duration-500 delay-200">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm focus:shadow-md transition-shadow duration-200"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {["all", "published", "draft"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as typeof filterStatus)}
                  className="capitalize transition-all duration-200 hover:scale-105 whitespace-nowrap"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid gap-4 md:gap-6">
        {filteredArticles.map((article, index) => (
          <Card
            key={article.id}
            className={`overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 border-0 bg-gradient-to-r from-background to-muted/10 group animate-in fade-in-50 slide-in-from-bottom-5 duration-500`}
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                    <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors duration-300 truncate">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={article.published ? "default" : "secondary"}
                        className={`shadow-sm transition-all duration-200 text-xs ${
                          article.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </Badge>
                      {article.featured && (
                        <Badge
                          variant="outline"
                          className="shadow-sm bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm">
                    <span>{article.categories?.name || "Uncategorized"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>By {article.author}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDate(article.created_at)}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublishStatus(article.id, article.published)}
                    className="flex-1 lg:flex-none hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {article.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="ml-2 lg:hidden">{article.published ? "Unpublish" : "Publish"}</span>
                  </Button>
                  <Link href={`/admin/articles/edit/${article.id}`} className="flex-1 lg:flex-none">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-2 lg:hidden">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteArticle(article.id)}
                    className="flex-1 lg:flex-none hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-2 lg:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            {article.excerpt && (
              <CardContent className="pt-0 p-4 md:p-6">
                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-300">
                  {article.excerpt}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-muted/20 animate-in fade-in-50 duration-500">
          <CardContent className="text-center py-12 md:py-16 p-4 md:p-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first article"}
            </p>
            <Link href="/admin/articles/new">
              <Button className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Create your first article
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
