const express = require('express')
const cookieParse = require('cookie-parser')
const multer = require("multer")
const uploadFile = require("./services/storage.service.js")
const cors = require('cors')
const StudentModel = require("./models/student.model.js")
const app = express()

app.use(cookieParse())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

const healthCheckRouter = require("./routes/healthcheck.route.js")
const authRouter = require("./routes/auth.routes.js")

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)


module.exports = app