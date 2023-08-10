const { v4, uuidv4 } = require('uuid');
const mssql = require('mssql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sqlConfig } = require('../database/config/dbconfig');
const dotenv = require('dotenv');
const { DB } = require('../database/helpers');
const { sendMail } = require('../EmailServices/email');

dotenv.config();

const getAllUsers = async (req, res) => {
	try {
		const users = await DB.exec('getAllUsersProcedure');
		if (users.recordset.length > 0) {
			return res.status(200).json(users.recordset);
		} else {
			return res.status(404).json({
				message: 'No users found',
			});
		}
	} catch (e) {
		console.log(e.message);
	}
};

const loginUser = async (req, res) => {
	try {
		const { Email, Password } = req.body;
		const user = await DB.exec('userLoginProcedure', { Email });

		if (user.recordset.length === 0) {
			return res.status(404).json({
				message: 'Could not find an account associated with the email address',
			});
		}

		const hashedPassword = user.recordset[0].Password;

		const passwordMatch = await bcrypt.compare(Password, hashedPassword);

		if (passwordMatch) {
			const payload = {
				UserID: user.recordset[0]?.UserID,
				Username: user.recordset[0]?.Username,
				Role: user.recordset[0]?.isAdmin === 1 ? 'admin' : 'user',
			};
			const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '36000' });
			// console.log(token);
			// console.log(payload);

			return res.status(200).json({
				message: 'Login successful',
				payload,
				token,
			});
		} else {
			return res.status(401).json({
				message: 'Incorrect Password',
			});
		}
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({
			message: e.message,
		});
	}
};

const registerUser = async (req, res) => {
	try {
		const UserId = v4();
		const { Username, Email, Password, isAdmin } = req.body;
		const existingUser = await DB.exec('checkExistingUser', { Email });
		if (existingUser.recordset.length > 0) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(Password, 5);
		const result = await DB.exec('registerUsersProcedure', {
			UserId,
			Username,
			Email,
			Password: hashedPassword,
			isAdmin,
		});

		if (result.returnValue === 0) {
			const userMessageOptions = {
				from: process.env.ADMIN_EMAIL,
				to: Email,
				subject: `Account Registration`,
				html: `<p> Hello ${Username}. Your account has been succesfully created. <br> Welcome Aboard. '.</p>`,
			};

			await sendMail(userMessageOptions);
			return res.status(200).json({ message: 'Account successfully registered' });
		} else {
			console.log(e.message, 'registration failed');
			return res.status(500).json({ message: 'Registration failed' });
		}
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({
			error: e.message,
		});
	}
};
const getUsersUnderProject = async (req, res) => {
	try {
		const { ProjectID } = req.params;

		const userProjects = await DB.exec('GetUsersUnderProject', { ProjectID }); // Replace 'GetUsersUnderProject' with the actual stored procedure name

		if (userProjects.recordset.length > 0) {
			return res.status(200).json(userProjects.recordset);
		} else {
			return res.status(404).json({ message: 'No users found under the project' });
		}
	} catch (e) {
		console.log(e.message);
		return res
			.status(500)
			.json({ error: 'An error occurred while fetching users under the project' });
	}
};

// const updateProjectStatus = async (req, res) => {
// 	try {
// 		const { ProjectID } = req.params;

// 		await DB.exec('updateProjectStatusProcedure', { ProjectID });

// 		const project = await DB.exec('getProjectByID', { ProjectID });

// 		if (project.recordset.length === 0) {
// 			return res.status(404).json({ error: 'Project not found' });
// 		}

// 		const userMessageOptions = {
// 			from: 'test@mail.com',
// 			to: process.env.ADMIN_EMAIL,
// 			subject: `Project Completion`,
// 			html: `<p> Hello. This is to notify you I have completed project '${project.recordset[0].Name}'.</p>`,
// 		};

// 		await sendMail(userMessageOptions);

// 		return res.status(200).json({ message: 'Project marked as complete' });
// 	} catch (e) {
// 		//await DB.query('ROLLBACK TRANSACTION');
// 		console.log(e.message);
// 		return res
// 			.status(500)
// 			.json({ error: 'An error occurred while marking the project as complete' });
// 	}
// };

const getASingleUser = async (req, res) => {
	try {
		const { userID } = req.params;

		console.log(userID);
		console.log('req.params:', req.params);
		const user = await DB.exec('GetUserByID', { UserID: userID });

		if (user.recordset.length === 0) {
			return res.status(404).json({ error: 'User not found' });
		}

		return res.status(200).json(user.recordset[0]);
	} catch (e) {
		console.error(e.message);
		return res.status(500).json({ error: 'An error occurred while fetching the user' });
	}
};
const getUseProject = async (req, res) => {
	try {
		const { userID } = req.params;
		const userProject = await DB.exec('GetUserProjects', { userID });
		if (userProject.recordset.length > 0) {
			return res.status(200).json(userProject.recordset);
		} else {
			return res.status(404).json({ message: 'no projects found' });
		}
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: `error occured while fetching project` });
	}
};

module.exports = {
	registerUser,
	getAllUsers,
	loginUser,
	getUsersUnderProject,
	// updateProjectStatus,
	getASingleUser,
	getUseProject,
};
