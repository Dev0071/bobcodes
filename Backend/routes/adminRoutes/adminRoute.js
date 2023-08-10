const express = require('express');
const updateProjectStatus = require('../../EmailServices/projectCompletedEmail.js');
const {
	assignProject,
	createProject,
	getAllProjects,
	deleteProject,
	getProjectByID,
	getUnassignedUsers,
} = require('../../controllers/adminControllers.js');

const adminRoute = express.Router();
adminRoute.post('/assign', assignProject);
adminRoute.post('/create/project', createProject);
adminRoute.get('/projects', getAllProjects);
adminRoute.get('/unassigned', getUnassignedUsers);
adminRoute.delete('/project/:ProjectName', deleteProject);
adminRoute.patch('/project/mark-complete/:ProjectID', updateProjectStatus);
adminRoute.get('/project/:ProjectID', getProjectByID);

module.exports = adminRoute;
