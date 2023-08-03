const { DB } = require('../database/helpers/index.js');
const { v4: uuidv4 } = require('uuid');
const { sendMail } = require('../EmailServices/email.js');

const createProject = async (req, res) => {
	try {
		const { Name, Description, EndDate } = req.body;
		const ProjectID = uuidv4();
		const existingProject = await DB.exec('getProjectsByName', { Name });
		if (existingProject.recordset.length) {
			return res.status(409).json({ error: 'Project with the same name already exists' });
		}

		await DB.exec('CreateProject', { ProjectID, Name, Description, EndDate });

		res.status(200).json({ message: 'Project created successfully' });
	} catch (error) {
		console.error('An error occurred:', error.message);
		return res.status(500).json({ error: 'Oops, project creation failed' });
	}
};

const getAllProjects = async (req, res) => {
	try {
		const allProjects = await DB.query('SELECT * FROM Projects');
		if (allProjects.recordset.length === 0) {
			return res.status(404).json({ message: 'No projects found' });
		}

		res.status(200).json(allProjects.recordset);
	} catch (error) {
		console.error('An error occurred:', error.message);
		return res.status(500).json({ error: 'Oops, something went wrong' });
	}
};

const assignProject = async (req, res) => {
	try {
		const UserProjectID = uuidv4();
		const { UserID, ProjectID, Username, ProjectName } = req.body;
		const existingAssignment = await DB.exec('checkUserAssignment', { UserID });
		if (existingAssignment.recordset.length) {
			return res.status(409).json({ error: 'User already has a project assigned' });
		}
		await DB.exec('AssignProjectToUser', {
			UserProjectID,
			UserID,
			Username,
			ProjectID,
			ProjectName,
		});

		const userResult = await DB.query(`SELECT Email FROM Users WHERE UserID = '${UserID}'`);

		if (userResult && userResult.recordset.length > 0) {
			const userEmail = userResult.recordset[0].Email;
			// Send project assignment email to the user
			const userMessageOptions = {
				from: process.env.EMAIL,
				to: userEmail,
				subject: `You have been assigned to a new project: ${ProjectName}`,
				html: `<p>You have been assigned to the project: ${ProjectName}. Please log in to your account to view the details.</p>`,
			};

			await sendMail(userMessageOptions);
		}

		return res.status(200).json({ message: 'Project assigned successfully' });
	} catch (error) {
		console.error('Error assigning project:', error);
		return res.status(500).json({ error: 'An error occurred while assigning the project' });
	}
};

const deleteProject = async (req, res) => {
	try {
		const { ProjectName } = req.params;

		await DB.exec('deleteProject', { ProjectName: ProjectName });

		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		console.error('An error occurred:', error.message);
		return res.status(500).json({ error: 'Oops, project deletion failed' });
	}
};

module.exports = { assignProject, createProject, getAllProjects, deleteProject };
