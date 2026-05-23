import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { signInSchema, signUpSchema } from "../validation/validateSchema.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "SECRET";
    

export const signup = async (req: Request, res: Response) => {
    try {
        const parsed = signUpSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { firstName, lastName, email, password } = parsed.data;

        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).json({
                success: false,
                message: "User already exists with that email",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const parsed = signInSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Password is wrong",
            });
            return;
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "30d" });

        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json({
                success: true,
                message: "User signed in successfully",
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    token: token
                },
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
