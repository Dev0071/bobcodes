const {v4} = require('uuid')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sqlConfig} = require("../config/dbconfig");
const dotenv = require('dotenv');
const {DB} = require("../helpers");

dotenv.config();

const getAllUsers = async (req, res) => {
    try {
        const users = await DB.exec("getAllUsersProcedure")
        if(users.recordset.length>0){
            return res.status(200).json(
                users.recordset
            )
        }
    }catch (e) {
        console.log(e.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Call the stored procedure with the correct argument (Email only)
        const user = await DB.exec("userLoginProcedure", { Email });

        if (user.recordset.length === 0) {
            return res.status(404).json({
                message: "Could not find an account associated with the email address",
            });
        }

        const hashedPassword = user.recordset[0].Password;


        const passwordMatch = await bcrypt.compare(Password, hashedPassword);

        if (passwordMatch) {
            const payload = {
                UserID: user.recordset[0]?.UserID,
                Username: user.recordset[0]?.Username,
                Role: user.recordset[0]?.isAdmin === 1 ? "admin" : "user",
            };
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '36000' });

            return res.status(200).json({
                message: "Login successful",
                token,
            });
        } else {
            return res.status(401).json({
                message: "Incorrect Password",
            });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            message: e.message,
        });
    }
};


const registerUser = async (req, res) => {
    try {
        const UserId = v4();
        const {Username, Email, Password, isAdmin} = req.body;
        const existingUser = await DB.exec("checkExistingUser", {Email});
        if (existingUser.recordset.length > 0) {
            return res.status(409).json({message: "User already exists"});
        }


        const hashedPassword = await bcrypt.hash(Password, 5);
        const result = await DB.exec("registerUsersProcedure", {
            UserId,
            Username,
            Email,
            Password: hashedPassword,
            isAdmin,
        });

        if (result.returnValue === 0) {
            return res.status(200).json({message: "Account successfully registered"});
        } else {
            return res.status(500).json({message: "Registration failed"});
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            error: e.message,
        });
    }
};


module.exports = {
    registerUser,
    getAllUsers,
    loginUser
}