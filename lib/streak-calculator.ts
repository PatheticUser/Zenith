// Function to calculate the current streak based on completed tasks
export function calculateStreak(completedTasks: { updated_at: string }[]): number {
  if (!completedTasks || completedTasks.length === 0) {
    return 0
  }

  // Sort tasks by date (newest first)
  const sortedTasks = [...completedTasks].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )

  // Get today's date (without time)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if there's activity today
  const latestTaskDate = new Date(sortedTasks[0].updated_at)
  latestTaskDate.setHours(0, 0, 0, 0)

  // If the latest task is older than yesterday, streak is broken
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (latestTaskDate < yesterday) {
    return 0
  }

  // Count consecutive days with activity
  let streak = 0
  const currentDate = new Date(today)

  // Create a map of dates with activity
  const datesWithActivity = new Map<string, boolean>()
  for (const task of sortedTasks) {
    const taskDate = new Date(task.updated_at)
    taskDate.setHours(0, 0, 0, 0)
    datesWithActivity.set(taskDate.toISOString().split("T")[0], true)
  }

  // Count back from today to find the streak
  while (datesWithActivity.has(currentDate.toISOString().split("T")[0])) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}
