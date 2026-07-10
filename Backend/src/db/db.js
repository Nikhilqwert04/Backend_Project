import mongoose from 'mongoose';

async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGOOSE_KEY)
        console.log("Connected db")
    }
    catch(error){
        console.log("MonogoDB connection error",error)
        process.exit(1)
    }
}

export default connectdb;