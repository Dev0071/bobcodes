const {v4} = require('uuid')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sqlConfig} = require("../config/dbconfig");
const {pool} = require("mssql/lib/global-connection");
const dotenv = require('dotenv');

dotenv.config();

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
        const {Username, Email, Password} = req.body;
        const hashedPassword = await bcrypt.hash(Password, 5);
        const pool = await mssql.connect(sqlConfig);

        // Check if the email is already registered in the database
        const existingUser = await pool
            .request()
            .input("Email", mssql.NVarChar, Email)
            .query("SELECT TOP 1     Email FROM Users WHERE Email = @Email");

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
        const {Email, Password} = req.body;
        const pool = await mssql.connect(sqlConfig);

        const user = (
            await pool
                .request()
                .input("Email", mssql.NVarChar, Email)
                .execute("userLoginProcedure")
        ).recordset[0];


        if (user) {
            const hashedPassword = user.Password;
            const passwordMatch = await bcrypt.compare(Password, hashedPassword);

            if (passwordMatch) {
                /*  We get everything that was inside the user object, do away with the password and return the payload.
                * The payload has the rest of the things such as the name and email, role etc */
                const {Password, ...payload} = user

                const token = jwt.sign(payload, process.env.SECRET, {expiresIn : '36000'})

                return res.status(200).json({
                    message: "Login was successful",
                    token
                })

            } else {
                console.log("Incorrect password");
                return res.status(401).json({
                    message: "Incorrect password",
                });
            }
        } else {
            return res.status(404).json({
                message: "Could not find an account associated to that email address. Please retry."
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            Error: e,
        });
    }
};


module.exports = {
    registerUser,
    getAllUsers,
    loginUser
}