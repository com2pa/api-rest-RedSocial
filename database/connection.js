const moongose = require("mongoose")
const { PAGE_URL } = require("../config")

// Connect to MongoDB
const connection =async()=>{
    try {
        // conexion a nivel local con la base de datos
        await moongose.connect(PAGE_URL)
        console.log("Conectando a  MongoDB mi-red_social local.....")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
    }
}

module.exports = connection
