const { body } = require("express-validator")

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Not Email Format"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLowercase()
            .withMessage("Usename must be in lowercase")
            .isLength({ min: 3 })
            .withMessage("username must be 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is Required"),
        body("fullName")
            .optional()
            .trim()

    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is Invalid"),
        body("password")
            .notEmpty()
            .withMessage("Password is Required")

    ]
}

module.exports = { userRegisterValidator, userLoginValidator }