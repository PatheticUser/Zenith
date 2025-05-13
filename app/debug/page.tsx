"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSupabase } from "@/lib/supabase-provider"

export default function DebugPage() {
  const { supabase } = useSupabase()
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [userSession, setUserSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        setUserSession(data.session)
      } catch (err: any) {
        console.error("Error checking session:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [supabase])

  const testConnection = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/test-connection")
      const data = await response.json()
      setConnectionStatus(data)
    } catch (err: any) {
      console.error("Error testing connection:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Session</CardTitle>
            <CardDescription>Current authentication status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading session...</p>
            ) : userSession ? (
              <div>
                <p>User ID: {userSession.user.id}</p>
                <p>Email: {userSession.user.email}</p>
                <p>Authenticated: Yes</p>
              </div>
            ) : (
              <p>Not authenticated</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>Test connection to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus ? (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(connectionStatus, null, 2)}
              </pre>
            ) : (
              <p>Click the button below to test the connection</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if environment variables are set</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set"}</li>
              <li>
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
              </li>
              <li>SUPABASE_SERVICE_ROLE_KEY: {"(Not shown for security reasons)"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
