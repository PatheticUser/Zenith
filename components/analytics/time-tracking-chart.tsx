"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO, subDays } from "date-fns"

interface ProgressLog {
  log_date: string
  time_spent: number
}

interface TimeTrackingChartProps {
  progressLogs: ProgressLog[]
}

export function TimeTrackingChart({ progressLogs }: TimeTrackingChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Process data for the chart
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i)
    return {
      date: format(date, "yyyy-MM-dd"),
      minutes: 0,
    }
  })

  // Aggregate time spent by date
  const timeByDate = progressLogs.reduce(
    (acc, log) => {
      const date = format(parseISO(log.log_date), "yyyy-MM-dd")
      acc[date] = (acc[date] || 0) + (log.time_spent || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  // Merge with the last 30 days
  const data = last30Days.map((day) => ({
    date: day.date,
    minutes: timeByDate[day.date] || 0,
    hours: ((timeByDate[day.date] || 0) / 60).toFixed(1),
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
        <XAxis
          dataKey="date"
          stroke={isDark ? "#94a3b8" : "#64748b"}
          fontSize={12}
          tickFormatter={(value) => format(parseISO(value), "MMM dd")}
        />
        <YAxis
          stroke={isDark ? "#94a3b8" : "#64748b"}
          fontSize={12}
          label={{
            value: "Minutes",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fill: isDark ? "#94a3b8" : "#64748b" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
          formatter={(value: number) => [`${value} minutes (${(value / 60).toFixed(1)} hours)`, "Time Spent"]}
          labelFormatter={(label) => format(parseISO(label), "MMMM d, yyyy")}
        />
        <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
