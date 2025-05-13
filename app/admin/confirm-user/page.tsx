"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type UnconfirmedUser = {
  id: string
  email: string
  created_at: string
}

export default function AdminConfirmUserPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [unconfirmedUsers, setUnconfirmedUsers] = useState<UnconfirmedUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Check if the current user is authorized
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user.email === "rameezalipacific@gmail.com") {
        setIsAuthorized(true)
        fetchUnconfirmedUsers()
      } else {
        setError("Unauthorized. Only the admin can access this page.")
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  const fetchUnconfirmedUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const adminKey = process.env.ADMIN_SECRET_KEY || "dev_admin_key"
      const response = await fetch(`/api/admin/unconfirmed-users?adminKey=${adminKey}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch unconfirmed users")
      }

      setUnconfirmedUsers(data.users)
    } catch (error: any) {
      setError(error.message || "Failed to fetch unconfirmed users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUnconfirmedUsers().finally(() => setRefreshing(false))
  }

  const handleConfirmUser = async (userId: string) => {
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/confirm-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          adminKey: process.env.ADMIN_SECRET_KEY || "dev_admin_key",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm user")
      }

      setSuccess(`User confirmed successfully!`)

      // Remove the confirmed user from the list
      setUnconfirmedUsers(unconfirmedUsers.filter((user) => user.id !== userId))
    } catch (error: any) {
      setError(error.message || "Failed to confirm user")
    }
  }

  if (!isAuthorized && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Only the admin can access this page.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Admin: Unconfirmed Users</CardTitle>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
          <CardDescription>Confirm users without email verification</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="py-8 text-center">Loading unconfirmed users...</div>
          ) : unconfirmedUsers.length === 0 ? (
            <div className="py-8 text-center">
              <p>No unconfirmed users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unconfirmedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleConfirmUser(user.id)}>
                        Confirm User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
