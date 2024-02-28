const express = require("express")
const app = express()

require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Phần router hệ thống Task Master
const rolesRouter = require('./routes/roles-routes')
app.use("/api/roles", rolesRouter)





//Cổng chạy app
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {console.log("Server is running....")})