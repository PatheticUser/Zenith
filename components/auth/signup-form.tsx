"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Step 1: Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("User creation failed")
      }

      // Step 2: Manually create the profile
      const profileData = {
        userId: data.user.id,
        fullName,
        username: email.split("@")[0],
      }

      setDebugInfo({
        user: data.user,
        profileData,
      })

      // Create profile using our API
      const profileResponse = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        console.warn("Profile creation warning:", errorData)
        // Continue anyway - the trigger might handle it
      } else {
        console.log("Profile created successfully")
      }

      // After profile creation, add this code:
      // Send admin confirmation email
      try {
        const adminEmail = "rameezalipacific@gmail.com" // Your admin email

        const { error: adminEmailError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
          redirectTo: `${window.location.origin}/auth/admin-confirm?userId=${data.user.id}`,
        })

        if (adminEmailError) {
          console.warn("Failed to send admin confirmation email:", adminEmailError)
        } else {
          console.log("Admin confirmation email sent to:", adminEmail)
          setDebugInfo({
            ...debugInfo,
            adminConfirmation: {
              sent: true,
              email: adminEmail,
              userId: data.user.id,
            },
          })
        }
      } catch (adminError) {
        console.warn("Error sending admin confirmation:", adminError)
      }

      // Show success message
      setIsSuccess(true)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isSuccess ? (
          <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Registration successful! Please check your email to confirm your account.</p>
                <p className="text-sm">
                  We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox and spam folder.
                </p>
                <p className="text-sm">After confirming your email, you can log in to your account.</p>
                <Button variant="outline" className="mt-2" onClick={() => router.push("/login")}>
                  Go to Login
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        )}

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-xs overflow-auto">
            <p className="font-semibold">Debug Info:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
