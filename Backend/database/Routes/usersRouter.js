const {Router} = require('express')
const {registerUser, getAllUsers, loginUser} = require("../Controllers/userController");

const usersRouter = Router()

usersRouter.post("/register", registerUser)
usersRouter.get("/all-users", getAllUsers)
usersRouter.post("/login", loginUser)

module.exports = {
    usersRouter
}