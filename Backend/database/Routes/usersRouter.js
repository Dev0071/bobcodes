const {Router} = require('express')
const {registerUser, getAllUsers, loginUser} = require("../Controllers/userController");
const { validateUserRegistration, validateUserLogin } = require('../Middleware/verifyInput');

const usersRouter = Router()

usersRouter.post("/register", validateUserRegistration, registerUser)
usersRouter.get("/all-users", getAllUsers)
usersRouter.post("/login", validateUserLogin ,loginUser)

module.exports = {
    usersRouter
}