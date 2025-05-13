"use client"

import Link from "next/link"
import { formatDate, priorityColors, statusColors } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Database } from "@/lib/database.types"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

interface TasksOverviewProps {
  tasks: Task[]
}

export function TasksOverview({ tasks: initialTasks }: TasksOverviewProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleTaskStatusChange = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: completed ? "completed" : "todo" })
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Your upcoming tasks</CardDescription>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-2">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground">Create your first task to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted">
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
                      <p className="text-xs text-muted-foreground">
                        {task.due_date ? formatDate(task.due_date) : "No due date"}
                      </p>
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
        )}
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/tasks" className="w-full">
          <Button variant="outline" className="w-full">
            View All Tasks
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
