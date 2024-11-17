const mongoose = require("mongoose")
const { MONGO_URL } = require("../config")


// Connect to MongoDB
const connection =async()=>{
    try {
        // conexion a nivel local con la base de datos
        await mongoose.connect(MONGO_URL)
        console.log("Conectando a  MongoDB mi-red_social")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
    }
}

module.exports = connection
