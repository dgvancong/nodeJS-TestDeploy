const express = require("express")
const router = express.Router()

const exportController = require("../controller/export.controller")

router.get("/", exportController.getAll)
router.get("/:id", exportController.getById)
router.post("/", exportController.create)
router.put("/:id", exportController.update)
router.delete("/delete/:id", exportController.delete)

module.exports = router