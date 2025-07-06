"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Bell,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { useTheme } from "next-themes"

interface AdminUser {
  email: string
  name: string
  initials: string
}

function AdminSidebar() {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()

  const menuItems = [
    { title: "Dashboard", href: "/admin", icon: BarChart3 },
    { title: "Articles", href: "/admin/articles", icon: FileText },
    { title: "Categories", href: "/admin/categories", icon: FolderOpen },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-background">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="h-4 w-4 text-white" />
          </div>
          {(state === "expanded" || isMobile) && (
            <div className="animate-in fade-in-50 slide-in-from-left-5 duration-200">
              <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                News CMS
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={`
                relative overflow-hidden transition-all duration-200 rounded-lg
                ${state === "collapsed" && !isMobile ? "h-10 w-10 p-0 mx-auto" : "h-10 px-3"}
                ${
                  isActive(item.href)
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
              `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center w-full animate-in fade-in-50 slide-in-from-left-5 duration-300 ${
                        state === "collapsed" && !isMobile ? "justify-center" : "justify-start gap-3"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 flex-shrink-0 ${
                          isActive(item.href) ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                        }`}
                      />
                      {(state === "expanded" || isMobile) && (
                        <span className="font-medium animate-in fade-in-50 slide-in-from-left-5 duration-200 delay-100">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AdminSidebarFooter />
    </Sidebar>
  )
}

function AdminSidebarFooter() {
  const router = useRouter()
  const { state, isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser?.email) {
        const name =
          currentUser.email === "danish@gmail.com"
            ? "Danish"
            : currentUser.email === "admin@example.com"
              ? "Admin User"
              : currentUser.email.split("@")[0]

        setUser({
          email: currentUser.email,
          name: name,
          initials: name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2),
        })
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  if (!user) return null

  return (
    <SidebarFooter className="border-t border-border/40 p-3">
      <div className="space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full transition-all duration-200 hover:bg-muted/50 rounded-lg ${
            state === "collapsed" && !isMobile ? "h-10 w-10 p-0 mx-auto" : "h-10 px-3 justify-start"
          }`}
        >
          <div
            className={`flex items-center ${
              state === "collapsed" && !isMobile ? "justify-center" : "justify-start gap-3"
            } w-full`}
          >
            <div className="relative">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
              <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
            </div>
            {(state === "expanded" || isMobile) && (
              <span className="text-muted-foreground font-medium animate-in fade-in-50 slide-in-from-left-5 duration-200">
                {theme === "dark" ? "Light" : "Dark"} Mode
              </span>
            )}
          </div>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full transition-all duration-200 hover:bg-muted/50 rounded-lg ${
                state === "collapsed" && !isMobile ? "h-12 w-12 p-0 mx-auto" : "h-12 px-3 justify-start"
              }`}
            >
              <div
                className={`flex items-center w-full ${
                  state === "collapsed" && !isMobile ? "justify-center" : "justify-start gap-3"
                }`}
              >
                <Avatar className="h-8 w-8 border-2 border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-medium">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                {(state === "expanded" || isMobile) && (
                  <div className="flex items-center justify-between w-full animate-in fade-in-50 slide-in-from-left-5 duration-200">
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-lg">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarFooter>
  )
}

function AdminHeader({ user }: { user: AdminUser | null }) {
  const { isMobile } = useSidebar()

  return (
    <header className="border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-40">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          {isMobile && <SidebarTrigger className="md:hidden" />}

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
              <BarChart3 className="h-3 w-3 text-white" />
            </div>
            <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 h-8 w-8 md:h-9 md:w-9"
          >
            <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </Button>

          {user && (
            <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-2 rounded-lg bg-white dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 shadow-sm animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <Avatar className="h-6 w-6 md:h-7 md:w-7 border-2 border-emerald-300 dark:border-emerald-700">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-medium">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-medium text-emerald-700 dark:text-emerald-400">{user.name}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Administrator</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/admin/login") {
        setLoading(false)
        return
      }

      const currentUser = await getCurrentUser()
      const adminStatus = await isAdmin()

      if (currentUser && adminStatus) {
        setIsAuthenticated(true)

        const name =
          currentUser.email === "danish@gmail.com"
            ? "Danish"
            : currentUser.email === "admin@example.com"
              ? "Admin User"
              : currentUser.email?.split("@")[0] || "Admin"

        setUser({
          email: currentUser.email || "",
          name: name,
          initials: name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2),
        })
      } else {
        router.push("/admin/login")
      }
      setLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-600 dark:text-emerald-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={user} />
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">
            <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
