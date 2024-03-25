const express = require("express")
const router = express.Router()

const projectController = require("../controller/project.controller")

router.get("/", projectController.getAll)
router.get("/:id", projectController.getById)
router.get("/projectteam", projectController.projectTeam)
router.post("create/", projectController.create)
router.put("/update/:id", projectController.update)
router.delete("/delete/:id", projectController.delete)

module.exports = router