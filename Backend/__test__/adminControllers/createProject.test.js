const {
	createProject,
	getAllProjects,
	assignProject,
	deleteProject,
	getProjectByID,
	getUnassignedUsers,
} = require('../../controllers/adminControllers');
const { DB } = require('../../database/helpers/index.js');
const { sendMail } = require('../../EmailServices/email.js');

jest.mock('../../database/helpers/index.js');
jest.mock('../../EmailServices/email.js');

describe('creating a project', () => {
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

	it('one or more required fields are missing', async () => {
		const req = {
			body: { Name: '', Description: 'udigiydyelE', EndDate: '2023-09-12' },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await createProject(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'One or more required fields are missing' });
	});

	it('should retun project created successfully', async () => {
		const req = {
			body: { Name: 'fakeproject', Description: 'udigiydyelE', EndDate: '2023-09-12' },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
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
		DB.exec.mockResolvedValueOnce({ recordset: [] });
		DB.query.mockResolvedValueOnce({ recordset: [{ Email: 'ydieloie@gmail.com' }] });
		sendMail.mockResolvedValueOnce();
		await assignProject(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Project assigned successfully and a notification email has been sent',
		});
	});
	it('should retun user already asiigned a project', async () => {
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

		await assignProject(req, res);
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ error: 'User already assigned a project' });
	});

	it('should retun one or more required fields are missing ', async () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const req = {
			body: {
				UserID: '',
				Username: '874637nncnjs',
				ProjectID: '7874uruihoi',
				ProjectName: 'YDKLIJIDJJOID',
			},
		};

		await assignProject(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'One or more required fields are missing' });
	});
});

describe('delete a project', () => {
	it('should return project deleted successfully', async () => {
		const ProjectName = 'puduytdtf';
		const req = {
			params: { ProjectName },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		DB.exec.mockResolvedValueOnce({ recordset: [{ Message: 'Project deleted successfully' }] });
		await deleteProject(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
	});

	it('should return project not found', async () => {
		const ProjectName = 'puduytdtf';
		const req = {
			params: { ProjectName },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		DB.exec.mockResolvedValueOnce({ recordset: [{ Message: 'Project not found' }] });
		await deleteProject(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
	});
});

describe('get project by id', () => {
	it('should return a required field is missing', async () => {
		const ProjectID = '';
		const req = {
			params: { ProjectID },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await getProjectByID(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'ProjectID parameter is missing' });
	});

	it('should return project not found', async () => {
		const ProjectID = 'ijydfdtr5rasrdxff';
		const req = {
			params: { ProjectID },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await getProjectByID(req, res);
		DB.exec.mockResolvedValueOnce({ recordset: [] });
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
	});

	it('should return project a project', async () => {
		const expectedProject = {
			ProjectID: '6C59B668-A82A-4EA7-A667-844DC19A8549',
			Name: 'p4',
			Description: 'mongo is a db...',
			EndDate: '2023-11-23T00:00:00.000Z',
			IsComplete: true,
		};
		const ProjectID = '6C59B668-A82A-4EA7-A667-844DC19A8549';
		const req = {
			params: { ProjectID },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		await getProjectByID(req, res);
		DB.exec.mockResolvedValueOnce({ recordset: [{ expectedProject }] });
	});
});

describe('should get unassignedUsers', () => {
	it('should return no unassigned user', async () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const expectedUsers = [];
		const req = {};
		DB.query.mockResolvedValueOnce({ recordset: [] });
		await getUnassignedUsers(req, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'No unassigned users found' });
	});
	it('should return unassigned user', async () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const expectedUsers = [
			{
				UserID: 'e6883f23-27c6-45a7-a543-5490d86ddaaa',
				Username: 'hey',
				Email: 'hey@gmail.com',
			},
		];
		const req = {};
		DB.query.mockResolvedValueOnce({ recordset: [expectedUsers] });
		await getUnassignedUsers(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([expectedUsers]);
	});
});
