import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewProjectForm } from "@/components/projects/new-project-form"

export default async function NewProjectPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Project" text="Add a new project to your dashboard" />
      <div className="grid gap-8">
        <NewProjectForm userId={session.user.id} />
      </div>
    </DashboardShell>
  )
}
