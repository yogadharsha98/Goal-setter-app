const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)

        //console the string and adding colors from color pckg
        console.log(`MongoDB Connected: ${conn,mongoose.connection.host}`.cyan.underline)

    }catch (error){
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB