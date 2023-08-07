const {
	createProject,
	getAllProjects,
	assignProject,
	deleteProject,
} = require('../../controllers/adminControllers');
const { DB } = require('../../database/helpers/index.js');
const { sendMail } = require('../../EmailServices/email.js');

jest.mock('../../database/helpers/index.js');
jest.mock('../../EmailServices/email.js');

describe('creating a roject', () => {
	const req = {
		body: { Name: 'fakeproject', Description: 'udigiydyelE', EndDate: '2023-09-12' },
	};
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	it('should return project with the same name exists ', async () => {
		DB.exec.mockImplementationOnce(() => ({
			recordset: [{ Name: 'fakeproject', Description: 'udigiydyelE', EndDate: '2023-09-12' }],
		}));

		await createProject(req, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: 'Project with the same name already exists' });
	});

	it('should retun project created successfully', async () => {
		DB.exec.mockImplementationOnce(() => ({
			recordset: [],
		}));

		await createProject(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Project created successfully' });
	});
});

describe('geting all projects', () => {
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	const req = {};
	it('should return an array of all projects', async () => {
		const expectedArray = [
			{
				ProjectID: 'E956EA4B-C3FB-4B4F-8CB3-1647FC4E542D',
				Name: 'project 2',
				Description: 'jheoiufdowgeify',
				EndDate: '2023-09-04T00:00:00.000Z',
				IsComplete: true,
			},
			{
				ProjectID: '8E0B31DE-0BB9-479E-A4F2-2C12964191F9',
				Name: 'project 6',
				Description: 'jheoiufdowgeify',
				EndDate: '2024-09-04T00:00:00.000Z',
				IsComplete: true,
			},
		];

		DB.query.mockImplementationOnce(() => ({
			recordset: expectedArray,
		}));

		await getAllProjects(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expectedArray);
	});

	it('should retun no projects found', async () => {
		DB.query.mockImplementationOnce(() => ({
			recordset: [],
		}));

		await getAllProjects(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'No projects found' });
	});
});

describe('assign user a project', () => {
	const req = {
		body: {
			UserID: '73587dygd',
			ProjectID: '7874uruihoi',
			Username: '874637nncnjs',
			ProjectName: 'YDKL;IJIDJJ;OID',
		},
	};

	const user = {
		UserId: 'user',
		Username: 'name',
		Email: 'uuiry@email',
		Password: 'hashedPassword',
		isAdmin: 0,
	};

	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	it('should return  user already assigned a project', async () => {
		DB.exec.mockImplementationOnce(() => ({ recordset: [user] }));

		await assignProject(req, res);
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json({ error: 'User already has a project assigned' }));
	});

	it('should retun user assigned successfully and a notifaction sent', async () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const req = {
			body: {
				UserID: '73587dygd',
				Username: '874637nncnjs',
				ProjectID: '7874uruihoi',
				ProjectName: 'YDKLIJIDJJOID',
			},
		};
		DB.exec.mockResolvedValueOnce({ rowsAffected: [1] });
		DB.query.mockResolvedValueOnce({ recordset: [{ Email: 'ydieloie@gmail.com' }] });
		sendMail.mockResolvedValueOnce();
		await assignProject(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Project assigned successfully and a notifaction email has been sent',
		});
	});

	it('should return project deleted successfully', async () => {
		const projectName = 'puduytdtf';
		const req = {
			params: projectName,
		};
		DB.exec.mockResolvedValueOnce({ rowsAffected: [1, 1, 1] });
		await deleteProject(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
	});
	it('should return project not found', async () => {
		const projectName = 'puduytdtf';
		const req = {
			params: projectName,
		};
		DB.exec.mockResolvedValueOnce({ rowsAffected: [0] });
		await deleteProject(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
	});
});
