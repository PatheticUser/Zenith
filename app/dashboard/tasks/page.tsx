import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TasksList } from "@/components/tasks/tasks-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TasksPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*, projects(title)")
    .eq("user_id", session.user.id)
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching tasks:", error)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks" text="Manage your tasks">
        <Link href="/dashboard/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </DashboardHeader>
      <TasksList tasks={tasks || []} />
    </DashboardShell>
  )
}
