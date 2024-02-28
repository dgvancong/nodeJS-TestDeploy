const express = require("express")
const router = express.Router()

const notificationsController = require("../controller/notifications.controller")

router.get("/", notificationsController.getAll)
router.get("/:id", notificationsController.getById)
router.post("/", notificationsController.create)
router.put("/:id", notificationsController.update)
router.delete("/delete/:id", notificationsController.delete)

module.exports = router