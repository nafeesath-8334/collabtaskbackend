const mongoose = require("mongoose")
const connectionString = process.env.connectionString
mongoose.connect(connectionString).then(()=>{
    console.log('mongodb atlas connected with your server')
}).catch((error)=>{
    console.log(`database connection failed with: ${error}`)
    
})