import { Router } from "express";
import { getSubjects } from "../controllers/subject.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getSubjects);

export default router;
