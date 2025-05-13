"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate, priorityColors, statusColors } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Calendar, Clock, Plus, Edit } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string | null
  start_date: string | null
  due_date: string | null
  completed: boolean
  color: string | null
  created_at: string
  updated_at: string
}

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  priority: string | null
  status: string
  is_recurring: boolean
  recurrence_pattern: string | null
  created_at: string
  updated_at: string
}

interface ProjectDetailProps {
  project: Project
  tasks: Task[]
}

export function ProjectDetail({ project, tasks: initialTasks }: ProjectDetailProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isCompleting, setIsCompleting] = useState(false)
  const [projectStatus, setProjectStatus] = useState(project.completed)
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleTaskStatusChange = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: completed ? "completed" : "todo", updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) throw error

      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: completed ? "completed" : "todo" } : task)))

      toast({
        title: completed ? "Task completed" : "Task marked as todo",
        description: "Task status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleProjectCompletion = async () => {
    setIsCompleting(true)
    try {
      const { error } = await supabase
        .from("projects")
        .update({ completed: !projectStatus, updated_at: new Date().toISOString() })
        .eq("id", project.id)

      if (error) throw error

      setProjectStatus(!projectStatus)

      toast({
        title: !projectStatus ? "Project completed" : "Project reopened",
        description: !projectStatus ? "Project has been marked as completed" : "Project has been reopened",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  // Calculate project stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={projectStatus ? "default" : "outline"}>
                {projectStatus ? "Completed" : "In Progress"}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleProjectCompletion} disabled={isCompleting}>
                {isCompleting ? "Updating..." : projectStatus ? "Reopen" : "Mark Complete"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{project.start_date ? formatDate(project.start_date) : "Not set"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{project.due_date ? formatDate(project.due_date) : "Not set"}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Project Tasks</h3>
            <Link href={`/dashboard/tasks/new?project=${project.id}`}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </Link>
          </div>
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <p className="text-sm text-muted-foreground">Add tasks to track your progress</p>
                <Link href={`/dashboard/tasks/new?project=${project.id}`} className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={(checked) => {
                              handleTaskStatusChange(task.id, checked as boolean)
                            }}
                          />
                          <div>
                            <Link href={`/dashboard/tasks/${task.id}`}>
                              <p
                                className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                              >
                                {task.title}
                              </p>
                            </Link>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                            )}
                            {task.due_date && (
                              <p className="text-xs text-muted-foreground mt-1">Due {formatDate(task.due_date)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                              {task.priority}
                            </Badge>
                          )}
                          <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                            {task.status === "in_progress"
                              ? "In Progress"
                              : task.status === "completed"
                                ? "Completed"
                                : "Todo"}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Details</h3>
                <Link href={`/dashboard/projects/${project.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </Button>
                </Link>
              </div>
              <CardDescription>Additional information about this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">{project.description || "No description provided"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created</h4>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(project.created_at)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(project.updated_at)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Button variant="outline">Edit Project</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
