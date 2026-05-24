import { Router } from "express";
import {
    getMe,
    logout,
    signin,
    signup,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;
