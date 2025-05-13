import { NextResponse } from "next/server"
import { createOrUpdateProfile } from "@/lib/direct-db-access"

export async function POST(request: Request) {
  try {
    const { userId, fullName, username, avatarUrl } = await request.json()

    console.log("API: Updating profile for user:", userId, { fullName, username, avatarUrl })

    if (!userId) {
      console.error("Missing userId in update-profile request")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await createOrUpdateProfile(userId, {
      full_name: fullName,
      username,
      avatar_url: avatarUrl,
    })

    if (error) {
      console.error("Profile update error:", error)
      return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
    }

    console.log("Profile updated successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Unexpected error in update-profile route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
