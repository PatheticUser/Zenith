"use client"

import { motion } from "framer-motion"
import { CalendarDays, CheckCircle, LineChart, ListTodo, Repeat, Target } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Target className="h-10 w-10 text-purple-600" />,
      title: "Goal Setting",
      description: "Create short and long-term goals with clear objectives and timelines.",
    },
    {
      icon: <ListTodo className="h-10 w-10 text-purple-600" />,
      title: "Task Management",
      description: "Break down goals into manageable tasks with priorities and due dates.",
    },
    {
      icon: <Repeat className="h-10 w-10 text-purple-600" />,
      title: "Recurring Tasks",
      description: "Set up recurring tasks for daily, weekly, or monthly routines.",
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-purple-600" />,
      title: "Calendar Integration",
      description: "Visualize your schedule and deadlines in an intuitive calendar view.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-purple-600" />,
      title: "Progress Tracking",
      description: "Monitor your progress with visual analytics and detailed statistics.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-purple-600" />,
      title: "Achievement System",
      description: "Celebrate your wins with our built-in achievement system.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to succeed</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Zenith combines powerful features with a beautiful, intuitive interface to help you achieve your goals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
