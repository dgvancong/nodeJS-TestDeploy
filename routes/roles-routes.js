const express = require("express")
const router = express.Router()

const rolesController = require("../controller/roles.controller")

router.get("/", rolesController.getAll)
router.get("/:id", rolesController.getById)

module.exports = router