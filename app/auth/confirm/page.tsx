"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const supabase = createClientComponentClient()

        // Get token from URL
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token) {
          setError("Invalid confirmation link")
          setIsLoading(false)
          return
        }

        // Confirm the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        })

        if (error) {
          throw error
        }

        setIsSuccess(true)
      } catch (error: any) {
        console.error("Error confirming email:", error)
        setError(error.message || "Failed to confirm email")
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
            <CardDescription>Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-center">Confirming your email...</p>}

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
                    <p>Your email has been confirmed successfully!</p>
                    <p className="text-sm">You can now log in to your account.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button>{isSuccess ? "Go to Login" : "Back to Login"}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
