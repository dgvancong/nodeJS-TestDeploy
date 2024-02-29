const express = require("express")
const router = express.Router()

const taskController = require("../controller/task.controller")

router.get("/", taskController.getAll)
router.get("/:id", taskController.getById)
router.post("create/", taskController.create)
router.put("/update/:id", taskController.update)
router.delete("/delete/:id", taskController.delete)

module.exports = router