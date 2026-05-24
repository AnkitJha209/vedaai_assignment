"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopBar } from "@/components/veda/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Assignment = {
  _id: string
  title: string
  subjectId: string
  gradeLevel: string
  schoolName?: string
  dueDate: string
  questionBreakdown: { type: string; count: number; marksPerQuestion: number }[]
  totalQuestions: number
  totalMarks: number
  difficulty: string
  additionalInstructions?: string
  status: string
  createdAt: string
}

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showNoResultToast, setShowNoResultToast] = useState(false)

  useEffect(() => {
    if (!showNoResultToast) return
    const timeout = setTimeout(() => setShowNoResultToast(false), 3000)
    return () => clearTimeout(timeout)
  }, [showNoResultToast])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/assignments/${id}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/signin")
          return null
        }
        if (!res.ok) throw new Error("Failed to load assignment")
        const data = await res.json()
        return data?.data
      })
      .then((data) => setAssignment(data))
      .catch((err) => {
        console.error(err)
        setError("Could not load assignment")
      })
      .finally(() => setLoading(false))
  }, [id, router])

  return (
    <div className="space-y-6">
      <TopBar breadcrumbLabel={assignment?.title || "Assignment"} />

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-red-600">
          {error}
        </div>
      ) : !assignment ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Assignment not found.
        </div>
      ) : (
        <div className="grid gap-6">
          <Card className="rounded-xl border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {assignment.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Status: {assignment.status}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(assignment.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <div className="text-sm text-foreground">
                    {assignment.gradeLevel}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due</p>
                  <div className="text-sm text-foreground">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Questions
                  </p>
                  <div className="text-sm text-foreground">
                    {assignment.totalQuestions}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                  <div className="text-sm text-foreground">
                    {assignment.totalMarks}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Additional instructions
                </p>
                <div className="mt-1 text-sm text-foreground">
                  {assignment.additionalInstructions || "—"}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  disabled={buttonLoading}
                  onClick={async () => {
                    if (!id || buttonLoading) return
                    setButtonLoading(true)
                    try {
                      const res = await fetch(`/api/assignments/${id}/result`, {
                        credentials: "include",
                      })
                      if (res.status === 401) {
                        router.replace("/signin")
                        return
                      }
                      if (!res.ok) throw new Error("Failed to fetch result")
                      const json = await res.json()
                      const result = json?.data
                      if (!result || !result._id) {
                        setShowNoResultToast(true)
                        return
                      }
                      router.push(`/assignments/${id}/result/`)
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setButtonLoading(false)
                    }
                  }}
                >
                  {buttonLoading ? "Loading..." : "View Result"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/assignments")}
                >
                  Back to list
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground">
                Question Breakdown
              </h3>
              <div className="mt-4 space-y-3">
                {assignment.questionBreakdown.map((q, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="text-sm text-foreground">{q.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {q.count} × {q.marksPerQuestion} marks
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showNoResultToast ? (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg">
          No result exists yet for this assignment.
        </div>
      ) : null}
    </div>
  )
}
