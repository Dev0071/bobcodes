const jwt = require('jsonwebtoken');
const dotenv = require(`dotenv`);
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['token']
        if(!token){
            res.status(401).json({
                message: "Restricted access, please provide a token"
            })
        }

        req.info = jwt.verify(token, process.env.SECRET)

    } catch (e) {
        console.log(e)
        return res.status(401).json({
            message: e.message
        })
    }

    next()
}



module.exports = {
    verifyToken
}