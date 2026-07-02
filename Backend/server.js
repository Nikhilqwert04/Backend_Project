require("dotenv").config()
const app = require("./src/app")
const connectdb = require("./src/db/db")

connectdb()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is Running on port 3000")
        })

    })
    .catch((err)=>{
        console.log("MonogoDB connection error",err)
        process.exit(1)
    })