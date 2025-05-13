import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewTaskForm } from "@/components/tasks/new-task-form"

export default async function NewTaskPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user's projects for the dropdown
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Task" text="Add a new task to your projects" />
      <div className="grid gap-8">
        <NewTaskForm userId={session.user.id} projects={projects || []} />
      </div>
    </DashboardShell>
  )
}
