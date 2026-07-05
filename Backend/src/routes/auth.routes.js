const {Router} = require("express");
const { registerUser, login, logoutUser } = require("../controllers/auth.controllers.js");
const validate = require("../middlewares/validator.middleware.js");
const { userRegisterValidator, userLoginValidator } = require("../validates/validate.midd.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const router = Router();


router.route("/register").post(userRegisterValidator(),validate, registerUser)
router.route("/login").post(userLoginValidator(),validate,login)
router.route("/logout").post(verifyJWT, logoutUser )
module.exports = router;