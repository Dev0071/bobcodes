const {Router} = require('express')
const {createProject} = require("../Controllers/projectController");

const projectRouter = Router()

projectRouter.post("/new-project", createProject)


module.exports = {
    projectRouter
}