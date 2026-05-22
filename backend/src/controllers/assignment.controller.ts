import type { Request, Response } from "express";
import Assignment from "../models/assignment.model.js";
import { assignmentSchema } from "../validation/validateSchema.js";
import { assignmentQueue } from "../queues/assignment.queue.js";

export const createAssignment = async (req: Request, res: Response) => {
    try {
        const parsed = assignmentSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const assignmentPayload = Object.fromEntries(
            Object.entries({
                ...parsed.data,
                ownerId: userId,
                status: "pending",
            }).filter(([, value]) => value !== undefined),
        );

        const assignment = await Assignment.create(assignmentPayload);

        const job = await assignmentQueue.add(
            "generate-assignment",
            { assignmentId: assignment._id },
            {
                removeOnComplete: true,
                removeOnFail: false,
            },
        );

        await Assignment.findByIdAndUpdate(assignment._id, {
            jobId: job.id,
        });

        res.status(201).json({
            success: true,
            message: "Assignment created",
            assignmentId: assignment._id,
            jobId: job.id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
