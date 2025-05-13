import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a Supabase client with the service role key
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

export async function createUserProfile(
  userId: string,
  data: {
    full_name?: string
    username?: string
    avatar_url?: string
  },
) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking if profile exists:", fetchError)
      return { error: fetchError }
    }

    if (existingProfile) {
      // Update existing profile
      return supabaseAdmin
        .from("profiles")
        .update({
          full_name: data.full_name,
          username: data.username,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    } else {
      // Create new profile
      return supabaseAdmin.from("profiles").insert({
        id: userId,
        full_name: data.full_name || null,
        username: data.username || null,
        avatar_url: data.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error in createUserProfile:", error)
    return { error }
  }
}
