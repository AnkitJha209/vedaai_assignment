import { Worker } from "bullmq";
import dotenv from "dotenv";
import {
    assignmentQueueConnection,
    emailQueueName,
} from "../queues/assignment.queue.js";

dotenv.config();

const startWorker = () => {
    const worker = new Worker(
        emailQueueName,
        async (job) => {
            const { to, subject, text } = job.data || {};
            if (!to || !subject || !text) {
                throw new Error("to, subject, and text are required");
            }

            // Placeholder for real email integration.
            console.log("Sending email", { to, subject, text });
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", (job, error) => {
        console.error("Email job failed", { jobId: job?.id, error });
    });
};

startWorker();
