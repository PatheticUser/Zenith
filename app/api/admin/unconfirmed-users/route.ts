import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

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

export async function GET(request: Request) {
  try {
    // First, check if the current user is authorized
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: sessionData } = await supabase.auth.getSession()

    // Only allow the admin email to use this endpoint
    if (sessionData.session?.user.email !== "rameezalipacific@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use the admin client to fetch users without email confirmation
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter users who don't have email_confirmed_at set
    const unconfirmedUsers = data.users
      .filter((user) => !user.email_confirmed_at)
      .map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      }))

    return NextResponse.json({
      success: true,
      users: unconfirmedUsers,
    })
  } catch (error: any) {
    console.error("Unexpected error in unconfirmed-users route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
