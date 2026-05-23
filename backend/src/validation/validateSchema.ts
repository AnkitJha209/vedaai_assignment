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
    schoolName: z.string().trim().min(1).optional(),
    dueDate: z.coerce.date(),
    questionBreakdown: z
        .array(
            z.object({
                type: z.string().trim().min(1, "Question type is required"),
                count: z
                    .number()
                    .int()
                    .min(1, "Question count must be at least 1"),
                marksPerQuestion: z
                    .number()
                    .min(0, "Marks per question must be 0 or more"),
            }),
        )
        .min(1, "At least one question type is required"),
    totalQuestions: z
        .number()
        .int()
        .min(1, "Total questions must be at least 1")
        .optional(),
    totalMarks: z.number().min(0, "Total marks must be 0 or more").optional(),
    difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
    additionalInstructions: z.string().trim().optional(),
    fileUrl: z.string().optional(),
    fileText: z.string().optional(),
});
