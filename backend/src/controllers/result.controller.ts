import type { Request, Response } from "express";
import mongoose from "mongoose";
import Result from "../models/result.model.js";

export const getResultById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }

        const result = await Result.findOne({
            _id: id,
            ownerId: new mongoose.Types.ObjectId(userId),
        }).lean();
        if (!result) {
            res.status(404).json({
                success: false,
                message: "Result not found",
            });
            return;
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getResultPdf = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid id" });
            return;
        }

        const result = await Result.findOne({
            _id: id,
            ownerId: new mongoose.Types.ObjectId(userId),
        })
            .select("pdfUrl")
            .lean();
        if (!result?.pdfUrl) {
            res.status(404).json({ success: false, message: "PDF not found" });
            return;
        }

        res.redirect(result.pdfUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
