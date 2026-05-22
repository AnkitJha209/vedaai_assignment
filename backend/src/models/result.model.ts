import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
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
    sections: [
        {
            title: { type: String, required: true, trim: true },
            instruction: { type: String, required: true, trim: true },
            questions: [
                {
                    number: { type: Number, required: true },
                    text: { type: String, required: true },
                    type: { type: String, required: true },
                    difficulty: {
                        type: String,
                        required: true,
                        enum: ["easy", "medium", "hard"],
                    },
                    marks: { type: Number, required: true, min: 0 },
                    options: { type: [String], default: undefined },
                },
            ],
        },
    ],
    totalMarks: { type: Number, required: true, min: 0 },
    generatedAt: { type: Date, required: true, default: Date.now },
    pdfUrl: { type: String, default: undefined },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
