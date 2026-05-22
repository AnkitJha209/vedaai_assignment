import { z } from "zod";

export const signUpSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Invalid email").trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
    email: z.email("Invalid email").trim(),
    password: z.string().min(1, "Password is required"),
});
