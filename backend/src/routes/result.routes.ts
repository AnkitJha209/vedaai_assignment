import { Router } from "express";
import {
    getResultById,
    getResultPdf,
    getResults,
} from "../controllers/result.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getResults);
router.get("/:id/pdf", verifyToken, getResultPdf);
router.get("/:id", verifyToken, getResultById);

export default router;
