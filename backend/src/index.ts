import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" })
})

app.listen(port, () => {  
    console.log("Server is running on port " + port)
})