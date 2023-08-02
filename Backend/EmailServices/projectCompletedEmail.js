const { DB } = require('../database/helpers/index.js');
const { sendMail } = require('../EmailServices/email.js');

const updateProjectStatus = async (req, res) => {
	try {
		const { ProjectID } = req.params;

		await DB.exec('updateProjectStatus', { ProjectID: ProjectID, IsComplete: 1 });

		const adminResult = await DB.query(`SELECT Email FROM Users WHERE isAdmin = 1`);
		const Projectresult = await DB.query(
			`SELECT Name FROM Projects WHERE ProjectID = '${ProjectID}'`,
		);

		const ProjectName = Projectresult.recordset[0].Name;

		if (adminResult && adminResult.recordset.length > 0) {
			const adminEmail = adminResult.recordset[0].Email;

			const messageOptions = {
				from: process.env.EMAIL,
				to: adminEmail,
				subject: `${ProjectName}  Completed'`,
				html: `<p> ${ProjectName} has been marked as complete. Please review the project</p>`,
			};

			await sendMail(messageOptions);
		}

		res
			.status(200)
			.json({ message: 'Project status updated successfully and admin has been notified' });
	} catch (error) {
		console.error('Error marking project as complete:', error);
		res.status(500).json({ error: 'Failed to mark project as complete' });
	}
};

module.exports = updateProjectStatus;
