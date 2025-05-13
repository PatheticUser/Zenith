import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/test-connection"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Connection successful" : "Connection failed",
      details: result,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Test failed with exception",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
