
const validateUserRegistration = (req, res, next) => {
    const { Username, Email, Password } = req.body

    if (!Username || !Email || !Password) {
        return res.status(400).json({
            message: "Ensure all fields are filled"
        })
    };

    if (!validateEmailFormat(Email)) {
        return res.status(400).json({
            message: "Invalid email format"
        })
    };


    next();
}


const validateUserLogin = (req, res, next) => {
    const { Email, Password } = req.body

    if (!Email || !Password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    if (!validateEmailFormat(Email)) {
        return res.status(400).json({
            message: "Invalid email format"
        })
    }

    next();
}

const validateEmailFormat = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

module.exports = {
    validateUserRegistration,
    validateUserLogin
}