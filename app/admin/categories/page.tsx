"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, FolderOpen, Hash } from "lucide-react"
import { supabase, type Category } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = async (name: string, excludeId?: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .neq("id", excludeId || "")

      if (error) {
        console.error("Error checking slug:", error)
        break
      }

      if (!data || data.length === 0) {
        break
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const slug = await generateSlug(formData.name, editingCategory?.id)

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategory.id)

        if (error) throw error
        toast({ title: "Success", description: "Category updated successfully" })
      } else {
        const { error } = await supabase.from("categories").insert([
          {
            name: formData.name,
            slug,
            description: formData.description || null,
          },
        ])

        if (error) throw error
        toast({ title: "Success", description: "Category created successfully" })
      }

      setFormData({ name: "", description: "" })
      setShowForm(false)
      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)

      let errorMessage = "Failed to save category"
      if (error.message?.includes("duplicate key")) {
        errorMessage = "A category with this name already exists. Please choose a different name."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const editCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setShowForm(true)
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setShowForm(false)
    setEditingCategory(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground animate-pulse">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center animate-in fade-in-50 slide-in-from-top-5 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-muted-foreground">Organize your content with categories</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 animate-in fade-in-50 slide-in-from-top-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              {editingCategory ? "Edit Category" : "New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="shadow-sm focus:shadow-md transition-shadow duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="shadow-sm focus:shadow-md transition-shadow duration-200"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  {editingCategory ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid gap-4">
        {categories.map((category, index) => (
          <Card
            key={category.id}
            className={`overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 border-0 bg-gradient-to-r from-background to-muted/10 group animate-in fade-in-50 slide-in-from-left-5 duration-500`}
            style={{ animationDelay: `${200 + index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="group-hover:text-purple-600 transition-colors duration-300">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="group-hover:text-foreground transition-colors duration-300">
                      {category.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editCategory(category)}
                    className="hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-muted/20 animate-in fade-in-50 duration-500">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">Create your first category to organize your content</p>
            <Button
              onClick={() => setShowForm(true)}
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
