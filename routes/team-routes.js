const express = require("express")
const router = express.Router()

const teamController = require("../controller/team.controller")

router.get("/", teamController.getAll)
router.get("/:id", teamController.getById)
router.post("/create", teamController.create)
router.put("/update/:id", teamController.update)
router.delete("/delete/:id", teamController.delete)

module.exports = router