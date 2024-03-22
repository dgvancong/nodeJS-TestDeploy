const express = require("express")
const app = express()

require('dotenv').config()
const bcrypt = require('bcrypt');

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Phần router hệ thống Task Master
const rolesRouter = require('./routes/roles-routes')
app.use("/roles", rolesRouter)

const teamRouter = require('./routes/team-routes')
app.use("/team", teamRouter)

const userRouter = require('./routes/user-routes')
app.use("/user", userRouter)

//Cổng chạy app
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {console.log("Hệ thống quản lý Task Master đang hoạt động....")})