const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeDatabase = async() => {
    try {
        await mongoose.connect(mongoUri)
            .then(console.log("DB connected"))

    } catch (error) {
        console.log("error connecting to db", error)
    }
}

module.exports = { initializeDatabase }