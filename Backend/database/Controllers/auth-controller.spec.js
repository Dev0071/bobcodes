import bcrypt from 'bcrypt';
import mssql from 'mssql';


const req = {
    body: {
        Username: "kefini",
        Email: "kefini@mail.com",
        Passwrod: "Garfield"
    }
}


const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
}

describe('employee registration', () => {
    it('it should register a new employee succesfully', async() => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce
    })
})