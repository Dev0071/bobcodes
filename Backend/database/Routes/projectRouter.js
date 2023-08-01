const {Router} = require('express')
const {createProject} = require("../Controllers/projectController");
const {verifyToken} = require("../Middleware/verifyToken");

const projectRouter = Router()

projectRouter.post("/new-project", verifyToken, createProject)


module.exports = {
    projectRouter
}