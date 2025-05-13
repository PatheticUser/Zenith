"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/lib/database.types"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

type Project = Database["public"]["Tables"]["projects"]["Row"]

interface ProjectsOverviewProps {
  projects: Project[]
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Your recent projects</CardDescription>
        </div>
        <Link href="/dashboard/projects/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-2">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground">Create your first project to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/dashboard/projects/${project.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full" style={{ backgroundColor: project.color || "#8b5cf6" }} />
                      <div>
                        <p className="text-sm font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.due_date ? formatDate(project.due_date) : "No due date"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={project.completed ? "default" : "outline"}>
                      {project.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/projects" className="w-full">
          <Button variant="outline" className="w-full">
            View All Projects
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
