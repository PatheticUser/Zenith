import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/dashboard/calendar-view"

export default async function CalendarPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, projects(title)")
    .eq("user_id", session.user.id)
    .order("due_date", { ascending: true })

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="View your tasks by date" />
      <CalendarView tasks={tasks || []} />
    </DashboardShell>
  )
}
