const express = require("express")
const router = express.Router()

const importController = require("../controller/import.controller")

router.post("create/", importController.create)

module.exports = router