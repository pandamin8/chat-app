import mongoose from 'mongoose'

function connectDB() {
    const mainDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD
    })
    
    return mainDB
}

export default connectDB()
