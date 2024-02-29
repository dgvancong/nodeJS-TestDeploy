const express = require("express")
const app = express()

require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Phần router hệ thống Task Master
const rolesRouter = require('./routes/roles-routes')
app.use("/roles", rolesRouter)

// const commentRouter = require('./routes/comment-routes')
// app.use("/comment", commentRouter)

// const exportRouter = require('./routes/export-routes')
// app.use("/export", exportRouter)

// const importRouter = require('./routes/import-routes')
// app.use("/import", importRouter)

// const notificationsRouter = require('./routes/notifications-routes')
// app.use("/notifications", notificationsRouter)

// const projectRouter = require('./routes/project-routes')
// app.use("/project", projectRouter)

// const taskRouter = require('./routes/task-routes')
// app.use("/task", taskRouter)

// const teamRouter = require('./routes/team-routes')
// app.use("/team", teamRouter)

// const userRouter = require('./routes/user-routes')
// app.use("/user", userRouter)

//Cổng chạy app
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {console.log("Server is running....")})