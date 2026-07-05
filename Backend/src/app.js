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

const upload = multer({ storage: multer.memoryStorage() })

app.post('/create-student', upload.single("image"), async (req, res) => {
    const response = await uploadFile(req.file.buffer)
    console.log(response)

    const details = await StudentModel.create({
        image: req.body.image,
        stuname: req.body.stuname,
        class: req.body.class,
        age: req.body.age
    })

    res.status(201).json({
        message: "Student Saved Succesfully", details
    })
})

app.get('/all-student', async (req, res) => {
    const details = await StudentModel.find()

    res.status(200).json({
        message: "All Student Details Fetched Succesfully", details
    })
})

app.patch("/student-edit/:id", async (req, res) => {
    const { id } = req.params
    console.log(id)
    const details = await StudentModel.findByIdAndUpdate({ _id: id }, {
        stuname: req.body.stuname,
        class: req.body.class,
        age: req.body.age

    })
    return res.status(200).json({
        message: "Datta editted Susccsfully", details
    })
})
module.exports = app