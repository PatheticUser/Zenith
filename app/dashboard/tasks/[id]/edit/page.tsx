import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EditTaskForm } from "@/components/tasks/edit-task-form"

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!task) {
    redirect("/dashboard/tasks")
  }

  // Get user's projects for the dropdown
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Task" text="Update your task details" />
      <div className="grid gap-8">
        <EditTaskForm task={task} projects={projects || []} />
      </div>
    </DashboardShell>
  )
}
