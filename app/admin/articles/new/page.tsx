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

export default function NewArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
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
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove all special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  }

  const ensureUniqueSlug = async (baseSlug: string) => {
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data, error } = await supabase.from("articles").select("id").eq("slug", slug).single()

      if (error || !data) {
        // Slug is unique
        break
      }

      // Slug exists, try with counter
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const baseSlug = generateSlug(formData.title)
      const uniqueSlug = await ensureUniqueSlug(baseSlug)

      const articleData = {
        ...formData,
        slug: uniqueSlug,
        category_id: formData.category_id || null,
        published_at: formData.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("articles").insert([articleData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Article created successfully!",
      })

      router.push("/admin/articles")
    } catch (error: any) {
      console.error("Error creating article:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">Create New Article</h1>
          <p className="text-muted-foreground">Add a new article to your news website</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>Fill in the information for your new article</CardDescription>
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
                {formData.title && (
                  <p className="text-xs text-muted-foreground">URL will be: /article/{generateSlug(formData.title)}</p>
                )}
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
                <Label htmlFor="published">Publish immediately</Label>
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
                {loading ? "Creating..." : "Create Article"}
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
