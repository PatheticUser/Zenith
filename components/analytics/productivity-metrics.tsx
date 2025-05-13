"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProjectStat {
  completed: boolean
}

interface TaskStat {
  status: string
}

interface ProductivityMetricsProps {
  projectStats: ProjectStat[]
  taskStats: TaskStat[]
}

export function ProductivityMetrics({ projectStats, taskStats }: ProductivityMetricsProps) {
  // Calculate project completion rate
  const totalProjects = projectStats.length
  const completedProjects = projectStats.filter((p) => p.completed).length
  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  // Calculate task completion rate
  const totalTasks = taskStats.length
  const completedTasks = taskStats.filter((t) => t.status === "completed").length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate in-progress rate
  const inProgressTasks = taskStats.filter((t) => t.status === "in_progress").length
  const inProgressRate = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Metrics</CardTitle>
        <CardDescription>Key metrics to track your productivity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Project Completion Rate</div>
            <div className="text-sm text-muted-foreground">{projectCompletionRate}%</div>
          </div>
          <Progress value={projectCompletionRate} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Task Completion Rate</div>
            <div className="text-sm text-muted-foreground">{taskCompletionRate}%</div>
          </div>
          <Progress value={taskCompletionRate} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Tasks In Progress</div>
            <div className="text-sm text-muted-foreground">{inProgressRate}%</div>
          </div>
          <Progress value={inProgressRate} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
