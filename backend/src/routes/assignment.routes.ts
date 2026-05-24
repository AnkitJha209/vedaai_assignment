import { Router } from "express";
import {
    createAssignment,
    duplicateAssignment,
    getAssignmentById,
    getAssignments,
    getAssignmentLatestResult,
    regenerateAssignment,
    searchAssignmentsAndResults,
} from "../controllers/assignment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createAssignment);
router.get("/", verifyToken, getAssignments);
router.get("/search", verifyToken, searchAssignmentsAndResults);
router.get("/:id", verifyToken, getAssignmentById);
router.get("/:id/result", verifyToken, getAssignmentLatestResult);
router.post("/:id/regenerate", verifyToken, regenerateAssignment);
router.post("/:id/duplicate", verifyToken, duplicateAssignment);

export default router;
