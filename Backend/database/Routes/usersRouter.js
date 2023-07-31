const {Router} = require('express')
const {registerUser, getAllUsers} = require("../Controllers/userControllers");

const usersRouter = Router()

usersRouter.post("/register", registerUser)
usersRouter.get("/all-users", getAllUsers)


module.exports = {
    usersRouter
}