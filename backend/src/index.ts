import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import { signin, signup } from "./controllers/auth.controller.js"
import { createAssignment } from "./controllers/assignment.controller.js"
import { verifyToken } from "./middlewares/auth.middleware.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" })
})

app.post("/api/auth/signup", signup)
app.post("/api/auth/signin", signin)
app.post("/api/create-assignment", verifyToken, createAssignment)

await connectDB()
app.listen(port, () => {  
    console.log("Server is running on port " + port)
})