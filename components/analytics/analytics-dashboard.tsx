"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCompletionChart } from "@/components/analytics/project-completion-chart"
import { TaskStatusChart } from "@/components/analytics/task-status-chart"
import { TimeTrackingChart } from "@/components/analytics/time-tracking-chart"
import { ProductivityMetrics } from "@/components/analytics/productivity-metrics"

interface ProjectStat {
  completed: boolean
}

interface TaskStat {
  status: string
}

interface ProgressLog {
  log_date: string
  time_spent: number
}

interface AnalyticsDashboardProps {
  projectStats: ProjectStat[]
  taskStats: TaskStat[]
  progressLogs: ProgressLog[]
}

export function AnalyticsDashboard({ projectStats, taskStats, progressLogs }: AnalyticsDashboardProps) {
  // Calculate project completion rate
  const totalProjects = projectStats.length
  const completedProjects = projectStats.filter((p) => p.completed).length
  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  // Calculate task status distribution
  const taskStatusCounts = taskStats.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate total time spent
  const totalTimeSpent = progressLogs.reduce((sum, log) => sum + (log.time_spent || 0), 0)

  // Format time spent in hours and minutes
  const hours = Math.floor(totalTimeSpent / 60)
  const minutes = totalTimeSpent % 60
  const formattedTimeSpent = `${hours}h ${minutes}m`

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="time">Time Tracking</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">{completedProjects} completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.length}</div>
              <p className="text-xs text-muted-foreground">{taskStatusCounts["completed"] || 0} completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">Project completion rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formattedTimeSpent}</div>
              <p className="text-xs text-muted-foreground">Total time spent on tasks</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ProjectCompletionChart projectStats={projectStats} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskStatusChart taskStats={taskStats} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="projects" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Completion</CardTitle>
            <CardDescription>Track the completion rate of your projects over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ProjectCompletionChart projectStats={projectStats} />
          </CardContent>
        </Card>
        <ProductivityMetrics projectStats={projectStats} taskStats={taskStats} />
      </TabsContent>
      <TabsContent value="tasks" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskStatusChart taskStats={taskStats} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="time" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Time Tracking</CardTitle>
            <CardDescription>Track time spent on tasks over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TimeTrackingChart progressLogs={progressLogs} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
