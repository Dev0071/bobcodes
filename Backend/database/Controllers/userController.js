const {v4} = require('uuid')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sqlConfig} = require("../config/dbconfig");
const dotenv = require('dotenv');

dotenv.config();

const getAllUsers = async (req, res) => {

    try {
        const pool = await mssql.connect(sqlConfig)
        const users = (await pool.request().execute("getAllUsersProcedure")).recordset
        if (users.length === 0) {
            return res.status(200).json({
                message: "There no users in the database"
            })
        } else {
            return res.status(200).json({
                users: users
            })
        }
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
        const { Username, Email, Password, isAdmin } = req.body; // Use provided isAdmin value
        const hashedPassword = await bcrypt.hash(Password, 5);
        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input("UserID", mssql.NVarChar, id)
            .input("Username", mssql.NVarChar, Username)
            .input("Email", mssql.NVarChar, Email)
            .input("Password", mssql.NVarChar, hashedPassword)
            .input("isAdmin", mssql.Bit, isAdmin) // Use provided isAdmin value
            .execute("registerUsersProcedure");

        if (result.rowsAffected > 0) {
            return res.status(200).json({
                message: "User successfully registered",
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            error: e.message,
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
                .input("Email", Email)
                .execute("userLoginProcedure")
        ).recordset[0];


        if (user) {
            const hashedPassword = user.Password;
            const passwordMatch = await bcrypt.compare(Password, hashedPassword);

            if (passwordMatch) {
                const payload = {
                    UserID: user.UserID,
                    Username: user.Username,
                    Role: user.isAdmin === 1 ? "admin" : "user"
                };

                const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '36000'})

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