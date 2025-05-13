import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a Supabase admin client with the service role key
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function POST(request: Request) {
  try {
    const { userId, fullName, username } = await request.json()

    console.log("API: Creating profile for user:", userId, { fullName, username })

    if (!userId) {
      console.error("Missing userId in create-profile request")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // First check if the profile already exists
    const { data: existingProfile } = await supabaseAdmin.from("profiles").select("id").eq("id", userId).single()

    if (existingProfile) {
      console.log("Profile already exists, updating instead")
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({
          full_name: fullName,
          username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
      }

      return NextResponse.json({ success: true, data, action: "updated" })
    }

    // Create new profile
    const { data, error } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: fullName,
      username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Profile creation error:", error)

      // If we get a foreign key violation, it might be a timing issue
      if (error.code === "23503") {
        // Foreign key violation
        // Wait a bit and try again
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const retryResult = await supabaseAdmin.from("profiles").insert({
          id: userId,
          full_name: fullName,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (retryResult.error) {
          console.error("Profile creation retry error:", retryResult.error)
          return NextResponse.json(
            { error: retryResult.error.message || "Failed to create profile after retry" },
            { status: 500 },
          )
        }

        return NextResponse.json({ success: true, data: retryResult.data, action: "created_retry" })
      }

      return NextResponse.json({ error: error.message || "Failed to create profile" }, { status: 500 })
    }

    console.log("Profile created successfully:", data)
    return NextResponse.json({ success: true, data, action: "created" })
  } catch (error: any) {
    console.error("Unexpected error in create-profile route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
