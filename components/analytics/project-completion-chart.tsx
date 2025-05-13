"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ProjectStat {
  completed: boolean
}

interface ProjectCompletionChartProps {
  projectStats: ProjectStat[]
}

export function ProjectCompletionChart({ projectStats }: ProjectCompletionChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Calculate project completion stats
  const totalProjects = projectStats.length
  const completedProjects = projectStats.filter((p) => p.completed).length
  const inProgressProjects = totalProjects - completedProjects

  const data = [
    {
      name: "Completed",
      value: completedProjects,
    },
    {
      name: "In Progress",
      value: inProgressProjects,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
        <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} />
        <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
        />
        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
