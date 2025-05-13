import { directSupabase } from "./direct-db-access"

export async function testSupabaseConnection() {
  try {
    // Test the direct connection with service role
    const { data, error } = await directSupabase.from("profiles").select("count(*)").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (err: any) {
    console.error("Unexpected error testing Supabase connection:", err)
    return {
      success: false,
      error: err.message,
      details: err,
    }
  }
}
