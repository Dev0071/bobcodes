const { Router } = require('express');
const {
	registerUser,
	getAllUsers,
	loginUser,
	updateProjectStatus,
	getASingleUser,
	getUsersUnderProject,
	getUseProject,
} = require('../../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../../Middleware/verifyInput');

const usersRouter = Router();

usersRouter.post('/register', validateUserRegistration, registerUser);
usersRouter.get('/all-users', getAllUsers);
usersRouter.post('/login', validateUserLogin, loginUser);
usersRouter.get('/projects/:userID', getUseProject);
usersRouter.get('/projects/user/:ProjectID', getUsersUnderProject);
usersRouter.post('/projects/mark-complete/:ProjectID', updateProjectStatus);
usersRouter.get('/user/:userID', getASingleUser);
module.exports = usersRouter;
