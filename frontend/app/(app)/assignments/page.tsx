"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, MoreVertical, Search, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TopBar } from "@/components/veda/topbar"
import { cn } from "@/lib/utils"

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
]

type Assignment = {
  _id: string
  title: string
  createdAt: string
  dueDate: string
  status: string
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || assignment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [assignments, search, statusFilter])

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/assignments", {
          credentials: "include",
        })
        if (response.status === 401) {
          router.replace("/signin")
          return
        }
        if (!response.ok) {
          throw new Error("Failed to fetch assignments")
        }
        const data = await response.json()
        setAssignments(data?.data || [])
      } catch (error) {
        console.error(error)
        setError("We could not load assignments. Please try again.")
        setAssignments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [router])

  return (
    <div className="space-y-6">
      <TopBar breadcrumbLabel="Assignments" />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Manage and create assignments for your classes.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filter By</span>
          <div className="relative">
            <select
              className="h-9 rounded-lg border border-border bg-white px-3 pr-8 text-sm text-foreground"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search Assignment"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading assignments...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-red-600">
          {error}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No assignments yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and
            let AI assist with grading.
          </p>
          <Button asChild className="mt-6 rounded-lg">
            <Link href="/assignments/create">
              + Create Your First Assignment
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="rounded-xl border border-border shadow-sm"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Assigned on:{" "}
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full border border-border bg-card p-1.5 text-muted-foreground">
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/assignments/${assignment._id}`}>
                          View Assignment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge
                  className={cn(
                    "w-fit capitalize",
                    assignment.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : assignment.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                  )}
                >
                  {assignment.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        asChild
        className="fixed bottom-20 left-1/2 z-20 w-[220px] -translate-x-1/2 rounded-full shadow-lg md:bottom-10"
      >
        <Link href="/assignments/create">+ Create Assignment</Link>
      </Button>
    </div>
  )
}
