"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase, type Category } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category_id: "",
    published: false,
    featured: false,
    image_url: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchArticle()
  }, [id])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title,
          excerpt: data.excerpt || "",
          content: data.content,
          author: data.author,
          category_id: data.category_id || "",
          published: data.published,
          featured: data.featured,
          image_url: data.image_url || "",
        })
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      toast({
        title: "Error",
        description: "Failed to fetch article",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = generateSlug(formData.title)

      // Check if slug already exists (excluding current article)
      const { data: existingArticle } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .single()

      let finalSlug = slug
      if (existingArticle) {
        // Add timestamp to make it unique
        finalSlug = `${slug}-${Date.now()}`
      }

      const articleData = {
        ...formData,
        slug: finalSlug,
        category_id: formData.category_id || null,
        published_at: formData.published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("articles").update(articleData).eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Article updated successfully!",
      })

      router.push("/admin/articles")
    } catch (error: any) {
      console.error("Error updating article:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update article",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <p className="text-muted-foreground">Update your article information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>Update the information for your article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="Brief summary of the article..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Write your article content here..."
                required
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured article</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Article"}
              </Button>
              <Link href="/admin/articles">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
