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
            const {
                to,
                assignmentTitle,
                pdfUrl,
                userName,
                assignmentId,
                requestSummary,
                scoreSummary,
            } = job.data || {};
            if (!to || !assignmentTitle || !pdfUrl || !assignmentId) {
                throw new Error(
                    "to, assignmentTitle, pdfUrl, and assignmentId are required",
                );
            }
            console.log("Processing email job with data:", job.data);

            const frontendBase = process.env.FRONTEND_ORIGIN;
            if (!frontendBase) {
                throw new Error("FRONTEND_URL is not set");
            }

            const base = frontendBase.replace(/\/$/, "");
            const resultUrl = `${base}/assignments/${encodeURIComponent(
                assignmentId,
            )}/result`;

            console.log("Generated result URL:", resultUrl);

            await sendAssignmentReadyEmail({
                to,
                assignmentTitle,
                pdfUrl,
                userName,
                resultUrl,
                requestSummary,
                scoreSummary,
            });

            console.log("Email sent successfully to", to);
        },
        { connection: assignmentQueueConnection },
    );

    worker.on("failed", (job, error) => {
        console.error("Email job failed", { jobId: job?.id, error });
    });
};

startWorker();
