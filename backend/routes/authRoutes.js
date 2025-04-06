const express = require('express');
const {Register,Login,Logout,isAuthorized,VerifyOtp,SendResetOtp,CheckEmail,VerifyResetOtp,ChangePwd} = require('../controllers/authController');
const UserAuth = require('../middleware/userAuth');

const AuthRouter = express.Router();

AuthRouter.post('/register', Register);
AuthRouter.post('/verifyotp', VerifyOtp);
AuthRouter.post('/login', Login);
AuthRouter.post('/checkemail', CheckEmail);
AuthRouter.post('/logout',UserAuth, Logout);
AuthRouter.post('/sendreset', SendResetOtp);
AuthRouter.post('/receivereset', VerifyResetOtp);
AuthRouter.post('/changepwd', ChangePwd);
AuthRouter.post('/isauthorized', UserAuth, isAuthorized);

module.exports = AuthRouter;
