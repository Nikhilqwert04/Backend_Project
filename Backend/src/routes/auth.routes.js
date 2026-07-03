const {Router} = require("express");
const registerUser = require("../controllers/auth.controllers.js");
const validate = require("../middlewares/validator.middleware.js")
const userRegisterValidator = require("../validates/validate.midd.js")
const router = Router();

router.route("/register").post(userRegisterValidator(),validate, registerUser)
module.exports = router;