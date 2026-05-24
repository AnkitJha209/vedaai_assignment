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

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    fullName: "",
    schoolName: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    if (formValues.password !== formValues.confirmPassword) {
      setFormError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    const nameParts = formValues.fullName.trim().split(" ")
    const firstName = nameParts.shift() || ""
    const lastName = nameParts.join(" ") || "Teacher"

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formValues.email,
          password: formValues.password,
        }),
      })

      const data = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setFormError(data.message || "Unable to create account.")
        setFieldErrors(data.errors || {})
        return
      }

      router.push("/signin")
    } catch (error) {
      console.error(error)
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f5f5f5] px-4">
      <Card className="w-full max-w-lg rounded-xl border border-border shadow-sm">
        <CardHeader className="space-y-4">
          <VedaLogo />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join VedaAI and start building assignments faster.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Priya Sharma"
                value={formValues.fullName}
                onChange={(event) =>
                  handleChange("fullName", event.target.value)
                }
              />
              {fieldErrors.firstName?.length ? (
                <p className="text-xs text-red-500">
                  {fieldErrors.firstName[0]}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  placeholder="Veda Public School"
                  value={formValues.schoolName}
                  onChange={(event) =>
                    handleChange("schoolName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Bengaluru"
                  value={formValues.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formValues.confirmPassword}
                  onChange={(event) =>
                    handleChange("confirmPassword", event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary" href="/signin">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
