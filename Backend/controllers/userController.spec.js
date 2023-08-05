const {v4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerUser, getAllUsers, loginUser} = require('../controllers/userController');
const {DB} = require('../database/helpers');

// Mock the DB class and its methods
jest.mock('../database/helpers', () => ({
    DB: {
        exec: jest.fn(),
    },
}));

// Mock the bcrypt.hash function
jest.mock('bcrypt', () => ({
    hash: jest.fn((password) => Promise.resolve('hashedPassword')),
    compare: jest.fn((password, hashedPassword) => Promise.resolve(true)),
}));

// Mock the jsonwebtoken.sign function
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fakeToken'),
}));

describe("Auth test suite", () => {

    const id = v4()

    describe("Get all users", () => {
        it("should return an empty array when there are no users and a status 404", async () => {
            // Set up the mock return value for DB.exec
            const users = { recordset: [] };
            DB.exec.mockResolvedValue(users);

            // Set up mock request and response objects
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the function
            await getAllUsers(req, res);

            // Check if the response status and json methods were called correctly
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "No users found"
            });
        });



    })
})
