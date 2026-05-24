"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopBar } from "@/components/veda/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Question = {
  number: number
  text: string
  type: string
  difficulty: string
  marks: number
  options?: string[]
  answer?: string
  solution?: string
}

type Section = {
  title: string
  instruction: string
  questions: Question[]
}

type Result = {
  _id: string
  assignmentId: string
  sections: Section[]
  answerKey?: { number: number; answer: string; solution?: string }[]
  pdfUrl?: string
}

export default function AssignmentResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/assignments/${id}/result`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/signin")
          return null
        }
        if (!res.ok) throw new Error("Failed to load result")
        const data = await res.json()
        return data?.data
      })
      .then((data) => setResult(data))
      .catch((err) => {
        console.error(err)
        setError("Could not load result")
      })
      .finally(() => setLoading(false))
  }, [id, router])

  return (
    <div className="space-y-6">
      <TopBar breadcrumbLabel={`Result`} />

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading result...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-red-600">
          {error}
        </div>
      ) : !result ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Result not found.
        </div>
      ) : (
        <div className="grid gap-6">
          <Card className="rounded-xl border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Result
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Result ID: {result._id}
                  </p>
                </div>
                <div className="flex gap-3">
                  {result.pdfUrl ? (
                    <a href={result.pdfUrl} target="_blank" rel="noreferrer">
                      <Button>Open PDF</Button>
                    </a>
                  ) : null}
                  <Button variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                {result.sections.map((section, sIndex) => (
                  <div key={sIndex} className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {section.instruction}
                    </p>
                    <div className="mt-3 space-y-3">
                      {section.questions.map((q) => (
                        <div
                          key={q.number}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="text-sm font-medium text-foreground">
                            {q.number}. {q.text}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Type: {q.type} · Marks: {q.marks}
                          </div>
                          {q.options?.length ? (
                            <ul className="mt-2 list-disc pl-5 text-sm text-foreground">
                              {q.options.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          ) : null}
                          {q.answer ? (
                            <div className="mt-2 text-sm text-primary">
                              Answer: {q.answer}
                            </div>
                          ) : null}
                          {q.solution ? (
                            <div className="mt-1 text-sm text-muted-foreground">
                              Solution: {q.solution}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {result.answerKey?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Answer Key
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-foreground">
                    {result.answerKey.map((a) => (
                      <div key={a.number}>
                        {a.number}. {a.answer}{" "}
                        {a.solution ? `— ${a.solution}` : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
