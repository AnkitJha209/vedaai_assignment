import mongoose, { Schema } from "mongoose";
import Subject from "./subject.model.js";

const assignmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        gradeLevel: { type: String, required: true, trim: true },
        dueDate: { type: Date, required: true },
        questionTypes: {
            type: [String],
            required: true,
            validate: {
                validator: async function (this: any, value: string[]) {
                    if (!this.subjectId) {
                        return false;
                    }

                    const subject = await Subject.findById(this.subjectId)
                        .select("questionTypes")
                        .lean();

                    if (!subject) {
                        return false;
                    }

                    return value.every((type) =>
                        subject.questionTypes.includes(type),
                    );
                },
                message:
                    "questionTypes contains values not allowed for selected subject.",
            },
        },
        totalQuestions: { type: Number, required: true, min: 1 },
        totalMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["easy", "medium", "hard", "mixed"],
        },
        additionalInstructions: {
            type: String,
            default: undefined,
            trim: true,
        },
        fileUrl: {
            type: String,
            default: undefined,
        },
        fileText: {
            type: String,
            default: undefined,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        jobId: {
            type: String,
            default: undefined,
        },
    },
    { timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
