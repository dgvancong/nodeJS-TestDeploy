const express = require("express")
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config()

app.use(morgan('dev'));
const port = 3000;
app.use(cors());
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Phần router hệ thống Task Master

const rolesRouter = require('./routes/roles-routes')
app.use("/roles", rolesRouter)

const teamRouter = require('./routes/team-routes')
app.use("/team", teamRouter)

const userRouter = require('./routes/user-routes')
app.use("/user", userRouter)

const projectRouter = require('./routes/project-routes')
app.use("/project", projectRouter)

const taskRouter = require('./routes/task-routes')
app.use("/task", taskRouter)

//Cổng chạy app
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  