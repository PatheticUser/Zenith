import { NextResponse } from "next/server"
import { createTask } from "@/lib/direct-db-access"

export async function POST(request: Request) {
  try {
    const { userId, projectId, title, description, dueDate, priority, isRecurring, recurrencePattern } =
      await request.json()

    console.log("API: Creating task:", {
      userId,
      projectId,
      title,
      description,
      dueDate,
      priority,
      isRecurring,
      recurrencePattern,
    })

    if (!userId) {
      console.error("Missing userId in create-task request")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!projectId) {
      console.error("Missing projectId in create-task request")
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    if (!title) {
      console.error("Missing title in create-task request")
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    const { data, error } = await createTask(userId, {
      project_id: projectId,
      title,
      description,
      due_date: dueDate,
      priority,
      is_recurring: isRecurring,
      recurrence_pattern: recurrencePattern,
    })

    if (error) {
      console.error("Task creation error:", error)
      return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 500 })
    }

    console.log("Task created successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Unexpected error in create-task route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
