"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Target, CheckSquare, Calendar, BarChart, Settings, Shield } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { useEffect, useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export function DashboardNav() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkIfAdmin() {
      const { data } = await supabase.auth.getSession()
      setIsAdmin(data.session?.user.email === "rameezalipacific@gmail.com")
      setLoading(false)
    }

    checkIfAdmin()
  }, [supabase])

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: <Target className="mr-2 h-4 w-4" />,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      title: "Admin",
      href: "/dashboard/admin",
      icon: <Shield className="mr-2 h-4 w-4" />,
      adminOnly: true,
    },
  ]

  if (loading) {
    return (
      <nav className="grid items-start gap-2 py-4">
        {navItems
          .filter((item) => !item.adminOnly)
          .map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
      </nav>
    )
  }

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems
        .filter((item) => !item.adminOnly || isAdmin)
        .map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        ))}
    </nav>
  )
}
