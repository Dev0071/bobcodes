const {v4} = require('uuid');
const mssql = require('mssql');
const {sqlConfig} = require("../config/dbconfig");

const createProject = async (req, res) => {

    try{
        const id= v4();
        const {Name, Description, StartDate, EndDate} = req.body
        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
            .input("ProjectID", mssql.VarChar, id)
            .input("Name", mssql.VarChar, Name)
            .input("Description", mssql.VarChar, Description)
            .input("StartDate", mssql.Date, StartDate)
            .input("EndDate", mssql.Date, EndDate)
            .execute("createProjectProcedure")


        console.log(result, "Result")
        if(result.rowsAffected > 0){
            return res.status(200).json({
                message: "Project created successfully"
            })
        } else{
            return res.status(400).json({
                message: "Project was not created"
            })
        }
    }catch (e) {
        console.log(e.message)
        return res.status(500).json({
            Error: e
        })
    }
}


module.exports = {
    createProject
}