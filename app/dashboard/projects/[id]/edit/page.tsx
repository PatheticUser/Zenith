import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EditProjectForm } from "@/components/projects/edit-project-form"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!project) {
    redirect("/dashboard/projects")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Project" text="Update your project details" />
      <div className="grid gap-8">
        <EditProjectForm project={project} />
      </div>
    </DashboardShell>
  )
}
