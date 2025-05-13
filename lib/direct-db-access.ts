import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Verify environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables. Check your .env.local file.", {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
  })
}

// Create a Supabase client with the service role key for direct database access
// This bypasses RLS policies completely
export const directSupabase = createClient<Database>(supabaseUrl || "", supabaseServiceKey || "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Helper function to create a profile
export async function createOrUpdateProfile(
  userId: string,
  data: { full_name?: string; username?: string; avatar_url?: string },
) {
  console.log("Creating/updating profile with direct access:", { userId, data })

  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await directSupabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching profile:", fetchError)
      return { error: fetchError }
    }

    if (!existingProfile) {
      // Create profile
      console.log("Profile doesn't exist, creating new profile")
      return directSupabase.from("profiles").insert({
        id: userId,
        full_name: data.full_name || null,
        username: data.username || null,
        avatar_url: data.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } else {
      // Update profile
      console.log("Profile exists, updating profile")
      return directSupabase
        .from("profiles")
        .update({
          full_name: data.full_name !== undefined ? data.full_name : existingProfile.full_name,
          username: data.username !== undefined ? data.username : existingProfile.username,
          avatar_url: data.avatar_url !== undefined ? data.avatar_url : existingProfile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    }
  } catch (err) {
    console.error("Unexpected error in createOrUpdateProfile:", err)
    return { error: { message: "Unexpected error occurred", details: err } }
  }
}

// Helper function to create a project
export async function createProject(
  userId: string,
  data: {
    title: string
    description?: string
    start_date?: string
    due_date?: string
    color?: string
  },
) {
  console.log("Creating project with direct access:", { userId, data })

  try {
    return directSupabase.from("projects").insert({
      user_id: userId,
      title: data.title,
      description: data.description || null,
      start_date: data.start_date || null,
      due_date: data.due_date || null,
      completed: false,
      color: data.color || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Unexpected error in createProject:", err)
    return { error: { message: "Unexpected error occurred", details: err } }
  }
}

// Helper function to create a task
export async function createTask(
  userId: string,
  data: {
    project_id: string
    title: string
    description?: string
    due_date?: string
    priority?: string
    is_recurring?: boolean
    recurrence_pattern?: string
  },
) {
  console.log("Creating task with direct access:", { userId, data })

  try {
    return directSupabase.from("tasks").insert({
      user_id: userId,
      project_id: data.project_id,
      title: data.title,
      description: data.description || null,
      due_date: data.due_date || null,
      priority: data.priority || "medium",
      status: "todo",
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.is_recurring ? data.recurrence_pattern || null : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Unexpected error in createTask:", err)
    return { error: { message: "Unexpected error occurred", details: err } }
  }
}
