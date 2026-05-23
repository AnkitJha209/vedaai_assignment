import { Worker } from "bullmq";
import dotenv from "dotenv";
import {
    assignmentQueueConnection,
    emailQueueName,
} from "../queues/assignment.queue.js";
import { sendAssignmentReadyEmail } from "../utils/emailFn.js";

dotenv.config();

const startWorker = () => {
    const worker = new Worker(
        emailQueueName,
        async (job) => {
            const { to, assignmentTitle, pdfUrl, userName } = job.data || {};
            if (!to || !assignmentTitle || !pdfUrl) {
                throw new Error("to, assignmentTitle, and pdfUrl are required");
            }

            await sendAssignmentReadyEmail({
                to,
                assignmentTitle,
                pdfUrl,
                userName,
            });
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", (job, error) => {
        console.error("Email job failed", { jobId: job?.id, error });
    });
};

startWorker();
