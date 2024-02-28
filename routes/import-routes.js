const express = require("express")
const router = express.Router()

const importController = require("../controller/import.controller")

router.get("/", importController.getAll)
router.get("/:id", importController.getById)
router.post("/", importController.create)
router.put("/:id", importController.update)
router.delete("/delete/:id", importController.delete)

module.exports = router