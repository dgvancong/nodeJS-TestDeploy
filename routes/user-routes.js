const express = require("express")
const router = express.Router()

const userController = require("../controller/user.controller")

router.get("/", userController.getAll)
router.get("/:id", userController.getById)
router.post("/register/", userController.create)
router.post("/login/", userController.login)
router.get("/userlogin/:userID", userController.userlogin)
router.delete("/delete/:id", userController.delete)

module.exports = router