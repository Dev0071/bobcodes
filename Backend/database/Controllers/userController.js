const {v4} = require('uuid')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sqlConfig} = require("../config/dbconfig");
const {pool} = require("mssql/lib/global-connection");


const getAllUsers = async (req, res) => {

    try {
        const pool = await mssql.connect(sqlConfig)
        const users = (await pool.request().execute("getAllUsersProcedure")).recordset
        return res.status(200).json({
            users: users
        })
    } catch (e) {
        console.log(e.message)
        return res.status(404).json({
            Error: e
        })
    }
}
const registerUser = async (req, res) => {
    try {
        const id = v4();
        const { Username, Email, Password } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 5);
        const pool = await mssql.connect(sqlConfig);

        // Check if the email is already registered in the database
        const existingUser = await pool
            .request()
            .input("Email", mssql.NVarChar, Email)
            .query("SELECT TOP 1 Email FROM Users WHERE Email = @Email");

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({
                error: "Email is already registered.",
            });
        }

        // Proceed with user registration if the email is not already registered
        const result = await pool.request()
            .input("UserID", mssql.NVarChar, id)
            .input("Username", mssql.NVarChar, Username)
            .input("Email", mssql.NVarChar, Email)
            .input("Password", mssql.NVarChar, hashedPassword)
            .input("isAdmin", mssql.Bit, 0)
            .execute("registerUsersProcedure");

        if (result.rowsAffected > 0) {
            return res.status(200).json({
                message: "User successfully registered",
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const {Email, password} = req.body
        console.log(Email)
        const pool = await mssql.connect(sqlConfig)
        const user = await pool.request().input("Email", Email).execute("userLoginProcedure")

    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Error: e
        })
    }
}


module.exports = {
    registerUser,
    getAllUsers,
    loginUser
}