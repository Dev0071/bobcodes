const {DB} = require('../../database/helpers/index')
const {
    getAllUsers,
    getASingleUser,
    getUseProject,
    loginUser,
    registerUser, updateProjectStatus
} = require("../../controllers/userController");
jest.mock('../../database/helpers/index.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendMail} = require("../../EmailServices/email");

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('Register user', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })
    it('should register a user successfully', async () => {
        const req = {
            body: {
                Username: 'testuser',
                Email: 'test@example.com',
                Password: 'password',
                isAdmin: 0,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockExistingUser = {recordset: []};
        const mockDBResult = {returnValue: 0};

        DB.exec.mockResolvedValueOnce(mockExistingUser);
        DB.exec.mockResolvedValueOnce(mockDBResult);
        bcrypt.hash = jest.fn(() => 'hashedPassword')
        // sendMail.mockResolvedValue();

        await registerUser(req, res);

        expect(DB.exec).toHaveBeenNthCalledWith(1, 'checkExistingUser', {Email: 'test@example.com'});
        expect(DB.exec).toHaveBeenNthCalledWith(2, 'registerUsersProcedure', {
            UserId: expect.any(String),
            Username: 'testuser',
            Email: 'test@example.com',
            Password: 'hashedPassword',
            isAdmin: 0,
        });
        //   expect(sendMail).toHaveBeenCalledWith(expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'Account successfully registered'});
    });


    it('should throw an error if user exists', async () => {
        const req = {
            body: {
                Username: 'testuser',
                Email: 'test@example.com',
                Password: 'password',
                isAdmin: 0,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockExistingUser = {recordset: [{Username: 'testuser', Email: 'test@example.com'}]};
        const mockDBResult = {returnValue: 1};

        DB.exec.mockResolvedValueOnce(mockExistingUser);
        DB.exec.mockResolvedValueOnce(mockDBResult);

        await registerUser(req, res);

        expect(DB.exec).toHaveBeenNthCalledWith(1, 'checkExistingUser', {Email: 'test@example.com'});
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({message: "User already exists"})
    });


})


describe('loginUser', () => {


    it('should throw an error if account doesnt exist', async () => {
        const mockedUsers = {
            recordset: []
        };

        DB.exec.mockResolvedValue(mockedUsers);

        const req = {
            body: {
                Email: 'kelvinian87@gmail.com',
                Password: 'Password'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await loginUser(req, res);

        expect(DB.exec).toHaveBeenCalledWith('userLoginProcedure', {Email: 'kelvinian87@gmail.com'});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Could not find an account associated with the email address"})
    });


    it('should login user successfully and return a token', async () => {
        const mockUser = {
            recordset: [
                {UserID: 1, Username: 'testuser', Email: 'test@example.com', Password: 'hashedPassword', isAdmin: 0},
            ],
        };
        const mockToken = 'mockedToken';

        DB.exec.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValueOnce(true)
        jwt.sign.mockReturnValue(mockToken);

        const req = {
            body: {Email: 'test@example.com', Password: 'password'},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


        await loginUser(req, res);

        expect(DB.exec).toHaveBeenCalledWith('userLoginProcedure', {
            Email: 'test@example.com'
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                UserID: 1,
                Username: 'testuser',
                Role: 'user',
            },
            process.env.SECRET,
            {expiresIn: '36000'}
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            token: mockToken,
        });
    })


});


describe('get all users', () => {
    it('should return users when they exist', async () => {
        const mockUsers = {recordset: [{id: 1, name: 'User1'}, {id: 2, name: 'User2'}]};
        DB.exec.mockResolvedValue(mockUsers);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllUsers(req, res);

        expect(DB.exec).toHaveBeenCalledWith('getAllUsersProcedure');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers.recordset);
    });

    it('should return "No users found" message when no users exist', async () => {
        DB.exec.mockResolvedValue({recordset: []});

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllUsers(req, res);

        expect(DB.exec).toHaveBeenCalledWith('getAllUsersProcedure');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No users found',
        });
    });

})

describe('get one user', () => {

    it('should return user with id', async () => {
        const mockUser = {recordset: [{UserId: 1, Username: "kevin"}]};
        DB.exec.mockResolvedValue(mockUser);

        const req = {
            params: {userID: 1},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getASingleUser(req, res);

        expect(DB.exec).toHaveBeenCalledWith("GetUserByID", {UserID: 1});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser.recordset[0]);
    });
    it('should handle error when user is not found and throw status 500', async () => {
        const errorMessage = 'Database error';
        DB.exec.mockRejectedValue(new Error(errorMessage));

        const req = {
            params: {userID: 1},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getASingleUser(req, res);

        expect(DB.exec).toHaveBeenCalledWith("GetUserByID", {UserID: 1});
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'An error occurred while fetching the user'});
    });
});

describe('Get projects assigned to user', () => {
    it('should return user projects when they exist', async () => {
        const mockProject = {recordset: [{ProjectId: 1, Name: 'Project1'}]};
        DB.exec.mockResolvedValue(mockProject);

        const req = {
            params: {userID: 1},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUseProject(req, res);

        expect(DB.exec).toHaveBeenCalledWith('GetUserProjects', {userID: 1});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockProject.recordset);
    });

    it('should return status 404 when no project is assigned', async () => {
        const mockProject = {recordset: []};
        DB.exec.mockResolvedValue(mockProject);

        const req = {
            params: {UserID: 1},
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUseProject(req, res);

        //  expect(DB.exec).toHaveBeenCalledWith('GetUserProjects', { UserID: 1 });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'no projects found'});
    });

})

describe('update project status', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })
    it('should mark a project complete and update its status', async () => {

        const mockProject = {
            recordset: [{
                ProjectID: 1,
                ProjectName: "Project Name goes here",
                ProjectDescription: "Project description goes here"
            }]
        }
        DB.exec.mockResolvedValue(mockProject)
        const req = {
            params: {ProjectID: 1},
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }


        await updateProjectStatus(req, res)

    //    expect(DB.exec).toHaveBeenNthCalledWith(1, "updateProjectStatusProcedure", {ProjectID: 1} )
     //   expect(DB.exec).toHaveBeenNthCalledWith(2, "getProjectByID", {ProjectID: 1})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: 'Project marked as complete'})


    })
})
