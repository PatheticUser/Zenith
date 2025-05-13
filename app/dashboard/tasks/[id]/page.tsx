import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TaskDetail } from "@/components/tasks/task-detail"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface TaskPageProps {
  params: {
    id: string
  }
}

export default async function TaskPage({ params }: TaskPageProps) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("*, projects(title)")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!task) {
    redirect("/dashboard/tasks")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={task.title} text={task.description || "No description"}>
        <Link href="/dashboard/tasks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </DashboardHeader>
      <TaskDetail task={task} />
    </DashboardShell>
  )
}
