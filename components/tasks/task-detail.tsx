"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate, priorityColors, statusColors } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Repeat } from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  priority: string | null
  status: string
  is_recurring: boolean
  recurrence_pattern: string | null
  project_id: string
  projects?: {
    title: string
  }
  created_at: string
  updated_at: string
}

interface TaskDetailProps {
  task: Task
}

export function TaskDetail({ task: initialTask }: TaskDetailProps) {
  const [task, setTask] = useState(initialTask)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", task.id)

      if (error) throw error

      setTask({ ...task, status })

      toast({
        title: "Task updated",
        description: `Task status changed to ${status}`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    setIsUpdating(true)
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id)

      if (error) throw error

      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully",
      })

      router.push("/dashboard/tasks")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getRecurrenceText = (pattern: string) => {
    if (pattern === "DAILY") return "Daily"
    if (pattern.includes("WEEKLY;BYDAY=MO")) return "Weekly on Monday"
    if (pattern.includes("WEEKLY;BYDAY=WE")) return "Weekly on Wednesday"
    if (pattern.includes("WEEKLY;BYDAY=FR")) return "Weekly on Friday"
    if (pattern === "MONTHLY") return "Monthly"
    return pattern
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                {task.status === "in_progress" ? "In Progress" : task.status === "completed" ? "Completed" : "Todo"}
              </Badge>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("todo")}
                  disabled={isUpdating || task.status === "todo"}
                >
                  Todo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("in_progress")}
                  disabled={isUpdating || task.status === "in_progress"}
                >
                  In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                  disabled={isUpdating || task.status === "completed"}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {task.priority ? (
              <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Not set</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{task.due_date ? formatDate(task.due_date) : "Not set"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/projects/${task.project_id}`}>
              <div className="text-sm font-medium hover:underline">{task.projects?.title || "Unknown Project"}</div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Additional information about this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">{task.description || "No description provided"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created</h4>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(task.created_at)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground mt-1">{formatDate(task.updated_at)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleDeleteTask} disabled={isUpdating}>
                {isUpdating ? "Processing..." : "Delete Task"}
              </Button>
              <Link href={`/dashboard/tasks/${task.id}/edit`}>
                <Button variant="default">Edit Task</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="recurrence">
          <Card>
            <CardHeader>
              <CardTitle>Recurrence Settings</CardTitle>
              <CardDescription>How often this task repeats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Repeat className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">Recurring Task</h4>
                  <p className="text-sm text-muted-foreground">{task.is_recurring ? "Yes" : "No"}</p>
                </div>
              </div>
              {task.is_recurring && task.recurrence_pattern && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Recurrence Pattern</h4>
                    <p className="text-sm text-muted-foreground">{getRecurrenceText(task.recurrence_pattern)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
