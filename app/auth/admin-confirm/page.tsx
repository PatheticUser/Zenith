"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AdminConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmUser = async () => {
      try {
        const supabase = createClientComponentClient()

        // Get userId from URL
        const userId = searchParams.get("userId")

        if (!userId) {
          setError("Missing user ID in URL")
          setIsLoading(false)
          return
        }

        // Call our admin API to confirm the user
        const response = await fetch("/api/admin/confirm-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            adminKey: "dev_admin_key", // This should be more secure in production
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to confirm user")
        }

        setIsSuccess(true)
      } catch (error: any) {
        console.error("Error confirming user:", error)
        setError(error.message || "Failed to confirm user")
      } finally {
        setIsLoading(false)
      }
    }

    confirmUser()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Admin Confirmation</CardTitle>
            <CardDescription>Confirming user account</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-center">Confirming user account...</p>}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>User has been confirmed successfully!</p>
                    <p className="text-sm">The user can now log in to their account.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
