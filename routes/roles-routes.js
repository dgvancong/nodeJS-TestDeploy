const express = require("express")
const router = express.Router()

const rolesController = require("../controller/roles.controller")

router.get("/", rolesController.getAll)
router.get("/:id", rolesController.getById)
router.post("/", rolesController.create)
router.put("/:id", rolesController.update)
router.delete("/delete/:id", rolesController.delete)

module.exports = router