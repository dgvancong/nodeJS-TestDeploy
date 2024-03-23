const express = require("express")
const router = express.Router()

const exportController = require("../controller/export.controller")

router.get("/", exportController.getExcel)

module.exports = router