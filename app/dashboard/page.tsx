import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { TasksOverview } from "@/components/dashboard/tasks-overview"
import { ProgressStats } from "@/components/dashboard/progress-stats"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { calculateStreak } from "@/lib/streak-calculator"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get user's tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(title)")
    .eq("user_id", session.user.id)
    .order("due_date", { ascending: true })
    .limit(5)

  // Get completed tasks count
  const completedTasksCountResult = await supabase
    .from("tasks")
    .select("id", { count: true, head: true })
    .eq("user_id", session.user.id)
    .eq("status", "completed")

  const completedTasksCount = completedTasksCountResult.count || 0

  // Get total tasks count
  const totalTasksCountResult = await supabase
    .from("tasks")
    .select("id", { count: true, head: true })
    .eq("user_id", session.user.id)

  const totalTasksCount = totalTasksCountResult.count || 0

  // Calculate completion rate
  const completionRate =
    totalTasksCount && totalTasksCount > 0 ? Math.round(((completedTasksCount || 0) / totalTasksCount) * 100) : 0

  // Get completed tasks with timestamps for streak calculation
  const { data: completedTasksWithDates } = await supabase
    .from("tasks")
    .select("updated_at")
    .eq("user_id", session.user.id)
    .eq("status", "completed")
    .order("updated_at", { ascending: false })

  // Calculate streak based on completed tasks
  const streak = calculateStreak(completedTasksWithDates || [])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your projects and tasks" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ProgressStats title="Projects" value={projects?.length || 0} description="Active projects" />
        <ProgressStats title="Tasks" value={tasks?.length || 0} description="Pending tasks" />
        <ProgressStats title="Completion Rate" value={`${completionRate}%`} description="Tasks completed" />
        <ProgressStats title="Streak" value={`${streak} days`} description="Current streak" />
      </div>
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ProjectsOverview projects={projects || []} />
            <TasksOverview tasks={tasks || []} />
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView tasks={tasks || []} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
