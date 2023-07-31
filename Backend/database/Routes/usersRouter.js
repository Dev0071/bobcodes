const {Router} = require('express')
const {registerUser} = require("../Controllers/userControllers");

const usersRouter = Router()

usersRouter.post("/register", registerUser)



module.exports = {
    usersRouter
}