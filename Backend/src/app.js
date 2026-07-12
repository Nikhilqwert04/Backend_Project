import express from 'express';
import cookieParse from 'cookie-parser';
import multer from "multer";
import uploadFile from "./services/storage.service.js";
import cors from 'cors';
import StudentModel from "./models/student.model.js";
const app = express()

app.use(cookieParse())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

import healthCheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("api/v2/projects",projectRouter)


export default app;