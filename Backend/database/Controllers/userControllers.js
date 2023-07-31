const {v4} = require('uuid')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {sqlConfig} = require("../config/dbconfig");

const registerUser = async (req, res) => {

    try {
        const id = v4();
        const {Username, Email, Password} = req.body
        const hashedPassword = await bcrypt.hash(Password, 5)
        const pool = await mssql.connect(sqlConfig)
        const result = await pool.request()
            .input('UserID', mssql.VarChar, id)
            .input('Username', mssql.VarChar, Username)
            .input('Email', mssql.VarChar, Email)
            .input('Password', mssql.VarChar, hashedPassword)
            .input("isAdmin", mssql.Bit, 1)
            .execute('registerUsersProcedure')


        if (result.rowsAffected > 0) {
            return res.status(200).json({
                message: "User successfully registered"
            })
        }

    } catch (e) {
        console.log(e.message)
        return res.status(400).json({
            Error: e.message
        })
    }

}
module.exports = {
    registerUser
}