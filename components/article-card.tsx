import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import type { Article } from "@/lib/supabase"

interface ArticleCardProps {
  article: Article & { categories?: { name: string; slug: string } }
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (featured) {
    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 bg-gradient-to-br from-background to-muted/20">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full overflow-hidden">
            <Image
              src={article.image_url || "/placeholder.svg?height=400&width=600"}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            {article.categories && (
              <Badge
                variant="secondary"
                className="w-fit mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in-50 slide-in-from-left-5"
              >
                {article.categories.name}
              </Badge>
            )}
            <CardTitle className="text-2xl md:text-3xl mb-4 leading-tight hover:text-primary transition-colors duration-300">
              {article.title}
            </CardTitle>
            <CardDescription className="text-base mb-6 line-clamp-3">{article.excerpt}</CardDescription>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                <Calendar className="h-4 w-4" />
                {formatDate(article.published_at || article.created_at)}
              </div>
              <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                <User className="h-4 w-4" />
                {article.author}
              </div>
            </div>
            <Link href={`/article/${article.slug}`}>
              <Button className="w-fit shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Read Full Story
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 group border-0 shadow-md bg-gradient-to-br from-background to-muted/10">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image_url || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {article.categories && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 shadow-md backdrop-blur-sm bg-background/80 hover:bg-background transition-all duration-200"
          >
            {article.categories.name}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
            <User className="h-4 w-4" />
            {article.author}
          </div>
          <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
            <Calendar className="h-4 w-4" />
            {formatDate(article.published_at || article.created_at)}
          </div>
        </div>
        <Link href={`/article/${article.slug}`}>
          <Button
            variant="outline"
            className="w-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            Read More
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
