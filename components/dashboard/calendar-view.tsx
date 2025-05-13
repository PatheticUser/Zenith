"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/lib/database.types"
import { Badge } from "@/components/ui/badge"
import { priorityColors } from "@/lib/utils"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

interface CalendarViewProps {
  tasks: Task[]
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Group tasks by date
  const tasksByDate = tasks.reduce(
    (acc, task) => {
      if (task.due_date) {
        const dateStr = new Date(task.due_date).toDateString()
        if (!acc[dateStr]) {
          acc[dateStr] = []
        }
        acc[dateStr].push(task)
      }
      return acc
    },
    {} as Record<string, Task[]>,
  )

  // Get tasks for selected date
  const selectedDateTasks = date ? tasksByDate[date.toDateString()] || [] : []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View your tasks by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              booked: Object.keys(tasksByDate).map((dateStr) => new Date(dateStr)),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                borderRadius: "0.25rem",
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tasks for {date?.toLocaleDateString()}</CardTitle>
          <CardDescription>
            {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks scheduled for this date</p>
          ) : (
            <div className="space-y-2">
              {selectedDateTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.priority && (
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  {task.description && <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
