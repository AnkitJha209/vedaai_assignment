"use client"

import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/veda/topbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Mixed", value: "mixed" },
]

type Subject = {
  _id: string
  name: string
  questionTypes: string[]
}

type BreakdownItem = {
  type: string
  count: string
  marksPerQuestion: string
}

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)
  const [subjectId, setSubjectId] = useState("")
  const [title, setTitle] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [difficulty, setDifficulty] = useState("mixed")
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [questionBreakdown, setQuestionBreakdown] = useState<BreakdownItem[]>(
    []
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true)
      try {
        const response = await fetch("/api/subjects", {
          credentials: "include",
        })
        if (response.status === 401) {
          router.replace("/signin")
          return
        }
        if (!response.ok) {
          throw new Error("Failed to load subjects")
        }
        const data = await response.json()
        setSubjects(data?.data || [])
      } catch (error) {
        console.error(error)
        setSubjects([])
      } finally {
        setSubjectsLoading(false)
      }
    }

    fetchSubjects()
  }, [router])

  useEffect(() => {
    if (!subjectId) {
      setQuestionBreakdown([])
      return
    }

    const subject = subjects.find((item) => item._id === subjectId)
    if (!subject) {
      return
    }

    setQuestionBreakdown(
      subject.questionTypes.map((type) => ({
        type,
        count: "1",
        marksPerQuestion: "1",
      }))
    )
  }, [subjectId, subjects])

  const totals = useMemo(() => {
    return questionBreakdown.reduce(
      (acc, item) => {
        const count = Number(item.count) || 0
        const marks = Number(item.marksPerQuestion) || 0
        return {
          totalQuestions: acc.totalQuestions + count,
          totalMarks: acc.totalMarks + count * marks,
        }
      },
      { totalQuestions: 0, totalMarks: 0 }
    )
  }, [questionBreakdown])

  const handleBreakdownChange = (
    index: number,
    field: keyof BreakdownItem,
    value: string
  ) => {
    setQuestionBreakdown((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item
      )
    )
  }

  const handleAddBreakdown = () => {
    const subject = subjects.find((item) => item._id === subjectId)
    const fallbackType = subject?.questionTypes[0] || ""
    if (!fallbackType) {
      return
    }

    setQuestionBreakdown((prev) => [
      ...prev,
      { type: fallbackType, count: "1", marksPerQuestion: "1" },
    ])
  }

  const handleRemoveBreakdown = (index: number) => {
    setQuestionBreakdown((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required.")
      return
    }
    if (!subjectId) {
      setError("Subject is required.")
      return
    }
    if (!gradeLevel.trim()) {
      setError("Grade level is required.")
      return
    }
    if (!dueDate) {
      setError("Due date is required.")
      return
    }
    if (questionBreakdown.length === 0) {
      setError("Add at least one question type.")
      return
    }

    const typeSet = new Set(questionBreakdown.map((item) => item.type))
    if (typeSet.size !== questionBreakdown.length) {
      setError("Question types must be unique.")
      return
    }

    const hasInvalidNumbers = questionBreakdown.some((item) => {
      const count = Number(item.count)
      const marks = Number(item.marksPerQuestion)
      return (
        Number.isNaN(count) || Number.isNaN(marks) || count < 1 || marks < 0
      )
    })
    if (hasInvalidNumbers) {
      setError("Counts must be at least 1 and marks cannot be negative.")
      return
    }

    const payload = {
      title: title.trim(),
      subjectId,
      gradeLevel: gradeLevel.trim(),
      schoolName: schoolName.trim() || undefined,
      dueDate,
      difficulty,
      additionalInstructions: additionalInstructions.trim() || undefined,
      questionBreakdown: questionBreakdown.map((item) => ({
        type: item.type,
        count: Number(item.count),
        marksPerQuestion: Number(item.marksPerQuestion),
      })),
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        router.replace("/signin")
        return
      }

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.success) {
        setError(data?.message || "Could not create assignment.")
        return
      }

      router.push("/assignments")
    } catch (error) {
      console.error(error)
      setError("Could not create assignment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <TopBar breadcrumbLabel="Create Assignment" />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Create assignment
        </h1>
        <p className="text-sm text-muted-foreground">
          Set the core details, choose a subject, and define the question
          breakdown.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="rounded-xl border border-border">
          <CardContent className="grid gap-5 p-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Assignment title</Label>
              <Input
                id="title"
                placeholder="Mid-term Algebra Review"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                disabled={subjectsLoading}
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade level</Label>
              <Input
                id="gradeLevel"
                placeholder="Grade 8"
                value={gradeLevel}
                onChange={(event) => setGradeLevel(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolName">School name (optional)</Label>
              <Input
                id="schoolName"
                placeholder="Veda Public School"
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {difficultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="instructions">Additional instructions</Label>
              <Textarea
                id="instructions"
                rows={4}
                placeholder="Include any special directions for the AI generator."
                value={additionalInstructions}
                onChange={(event) =>
                  setAdditionalInstructions(event.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Question breakdown
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose the types, number of questions, and marks for each.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddBreakdown}
                disabled={!subjectId}
              >
                Add type
              </Button>
            </div>

            {questionBreakdown.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Select a subject to load available question types.
              </div>
            ) : (
              <div className="space-y-3">
                {questionBreakdown.map((item, index) => (
                  <div
                    key={`${item.type}-${index}`}
                    className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1.5fr,1fr,1fr,auto]"
                  >
                    <div className="space-y-1">
                      <Label>Question type</Label>
                      <select
                        className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                        value={item.type}
                        onChange={(event) =>
                          handleBreakdownChange(
                            index,
                            "type",
                            event.target.value
                          )
                        }
                      >
                        {subjects
                          .find((subject) => subject._id === subjectId)
                          ?.questionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label>Count</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.count}
                        onChange={(event) =>
                          handleBreakdownChange(
                            index,
                            "count",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Marks each</Label>
                      <Input
                        type="number"
                        min={0}
                        value={item.marksPerQuestion}
                        onChange={(event) =>
                          handleBreakdownChange(
                            index,
                            "marksPerQuestion",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-sm text-red-600"
                        onClick={() => handleRemoveBreakdown(index)}
                        disabled={questionBreakdown.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Total questions: {totals.totalQuestions}</span>
              <span>Total marks: {totals.totalMarks}</span>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create assignment"}
          </Button>
        </div>
      </form>
    </div>
  )
}
