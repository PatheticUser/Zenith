import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestRoutesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Test Routes</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Project Routes</h2>
          <div className="space-x-4">
            <Link href="/dashboard/projects">
              <Button variant="outline">Projects List</Button>
            </Link>
            <Link href="/dashboard/projects/new">
              <Button>New Project</Button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Task Routes</h2>
          <div className="space-x-4">
            <Link href="/dashboard/tasks">
              <Button variant="outline">Tasks List</Button>
            </Link>
            <Link href="/dashboard/tasks/new">
              <Button>New Task</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
