import { Worker } from "bullmq";
import dotenv from "dotenv";
import Assignment from "../models/assignment.model.js";
import { connectDB } from "../config/database.js";
import {
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

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "processing",
            });

            // TODO: generate questions/results here and create Result document.

            await Assignment.findByIdAndUpdate(assignmentId, {
                status: "completed",
            });
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
