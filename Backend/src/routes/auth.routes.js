const {Router} = require("express");
const { registerUser, login, logoutUser, verifyEmail, refreshAccessToken, forgetPasswordRequest, resetPasswordForget, getCurrentUser, changeCurrentPassword, resendEmailVerification } = require("../controllers/auth.controllers.js");
const validate = require("../middlewares/validator.middleware.js");
const { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangedCurrentPasswordValidator } = require("../validates/validate.midd.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const router = Router();

//unsecure routes
router.route("/register").post(userRegisterValidator(),validate, registerUser)
router.route("/login").post(userLoginValidator(),validate,login)
router.route("/verify-email/:verificationToken").post(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgetPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator, validate, resetPasswordForget)


//secure routes
router.route("/logout").post(verifyJWT, logoutUser )
router.route("/current-user").post(verifyJWT, getCurrentUser )
router.route("/change-password").post(verifyJWT, userChangedCurrentPasswordValidator(), validate, changeCurrentPassword )
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification )





module.exports = router;