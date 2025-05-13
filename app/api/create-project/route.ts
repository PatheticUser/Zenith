import { NextResponse } from "next/server"
import { createProject } from "@/lib/direct-db-access"

export async function POST(request: Request) {
  try {
    const { userId, title, description, startDate, dueDate, color } = await request.json()

    console.log("API: Creating project:", { userId, title, description, startDate, dueDate, color })

    if (!userId) {
      console.error("Missing userId in create-project request")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!title) {
      console.error("Missing title in create-project request")
      return NextResponse.json({ error: "Project title is required" }, { status: 400 })
    }

    const { data, error } = await createProject(userId, {
      title,
      description,
      start_date: startDate,
      due_date: dueDate,
      color,
    })

    if (error) {
      console.error("Project creation error:", error)
      return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 })
    }

    console.log("Project created successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Unexpected error in create-project route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
