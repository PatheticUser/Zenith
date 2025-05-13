"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface TaskStat {
  status: string
}

interface TaskStatusChartProps {
  taskStats: TaskStat[]
}

export function TaskStatusChart({ taskStats }: TaskStatusChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Calculate task status distribution
  const statusCounts = taskStats.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = [
    {
      name: "To Do",
      value: statusCounts["todo"] || 0,
    },
    {
      name: "In Progress",
      value: statusCounts["in_progress"] || 0,
    },
    {
      name: "Completed",
      value: statusCounts["completed"] || 0,
    },
  ]

  const COLORS = ["#64748b", "#8b5cf6", "#10b981"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
