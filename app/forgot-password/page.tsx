import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function ForgotPasswordPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
