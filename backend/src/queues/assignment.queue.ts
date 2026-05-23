import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const assignmentQueueName = "assignment";

export const assignmentQueueConnection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
};

export const assignmentQueue = new Queue(assignmentQueueName, {
    connection: assignmentQueueConnection,
});
