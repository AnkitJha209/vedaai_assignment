import { Worker } from "bullmq";
import dotenv from "dotenv";
import Assignment from "../models/assignment.model.js";
import User from "../models/user.model.js";
import { connectDB } from "../config/database.js";
import {
    emailQueue,
    assignmentQueueConnection,
    assignmentQueueName,
} from "../queues/assignment.queue.js";

dotenv.config();

const startWorker = async () => {
    await connectDB();

    const worker = new Worker(
        assignmentQueueName,
        async (job) => {
            const { assignmentId } = job.data;
            if (!assignmentId) {
                throw new Error("assignmentId is required");
            }

            console.log("Processing assignment", { assignmentId });

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "processing",
            });

            console.log("Assignment updated to processing", { assignmentId });

            // TODO: generate questions/results here and create Result document.

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "completed",
            });

            const assignment = await Assignment.findById(assignmentId)
                .select("ownerId title");

            if (assignment?.ownerId) {
                const user = await User.findById(assignment.ownerId)
                    .select("email firstName lastName")

                if (user?.email) {
                    await emailQueue.add("assignment-complete", {
                        to: user.email,
                        subject: "Assignment created successfully",
                        text: `Hi ${user.firstName} ${user.lastName}, your assignment "${assignment.title}" is ready.`,
                        assignmentId,
                    });
                }
            }
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", async (job, error) => {
        if (job?.data?.assignmentId) {
            await Assignment.findByIdAndUpdate(job.data.assignmentId, {
                status: "failed",
            });
        }
        console.error("Assignment job failed", error);
    });
};

startWorker().catch((error) => {
    console.error(error);
    process.exit(1);
});
