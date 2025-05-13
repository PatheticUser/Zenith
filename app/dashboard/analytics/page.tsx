import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get project completion stats
  const { data: projectStats } = await supabase.from("projects").select("completed").eq("user_id", session.user.id)

  // Get task stats by status
  const { data: taskStats } = await supabase.from("tasks").select("status").eq("user_id", session.user.id)

  // Get progress logs for time tracking
  const { data: progressLogs } = await supabase
    .from("progress_logs")
    .select("log_date, time_spent")
    .eq("user_id", session.user.id)
    .order("log_date", { ascending: true })

  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Track your productivity and progress" />
      <AnalyticsDashboard
        projectStats={projectStats || []}
        taskStats={taskStats || []}
        progressLogs={progressLogs || []}
      />
    </DashboardShell>
  )
}
