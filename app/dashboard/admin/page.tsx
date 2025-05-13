import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserCheck } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if the user is the admin
  if (session.user.email !== "rameezalipacific@gmail.com") {
    redirect("/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" text="Administrative tools and settings" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and confirmations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard/admin/confirm-users">
                <Button className="w-full">Confirm Users</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Add more admin cards here as needed */}
      </div>
    </DashboardShell>
  )
}
