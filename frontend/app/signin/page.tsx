"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { VedaLogo } from "@/components/veda/logo"

type FieldErrors = Record<string, string[] | undefined>

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formValues),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(data.message || "Unable to sign in.")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("/assignments")
    } catch (error) {
      console.error(error)
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f5f5f5] px-4">
      <Card className="w-full max-w-md rounded-xl border border-border shadow-sm">
        <CardHeader className="space-y-4">
          <VedaLogo />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.com"
                value={formValues.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
              {fieldErrors.email?.length ? (
                <p className="text-xs text-red-500">{fieldErrors.email[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formValues.password}
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password?.length ? (
                <p className="text-xs text-red-500">
                  {fieldErrors.password[0]}
                </p>
              ) : null}
            </div>

            {formError ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {formError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-primary" href="/signup">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
