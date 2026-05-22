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

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

export const assignmentSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    subjectId: objectIdSchema,
    gradeLevel: z.string().trim().min(1, "Grade level is required"),
    dueDate: z.coerce.date(),
    questionTypes: z
        .array(z.string().trim().min(1))
        .min(1, "At least one question type is required"),
    totalQuestions: z
        .number()
        .int()
        .min(1, "Total questions must be at least 1"),
    totalMarks: z.number().min(0, "Total marks must be 0 or more"),
    difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
    additionalInstructions: z.string().trim().optional(),
    fileUrl: z.string().optional(),
    fileText: z.string().optional(),
});
