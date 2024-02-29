const express = require("express")
const router = express.Router()

const commentController = require("../controller/comment.controller")

router.get("/", commentController.getAll)
router.get("/:id", commentController.getById)
router.post("create/", commentController.create)
router.put("/update/:id", commentController.update)
router.delete("/delete/:id", commentController.delete)

module.exports = router