const express = require('express');
const {Register,Login,Logout,isAuthorized} = require('../controllers/authController');
const UserAuth = require('../middleware/userAuth');

const AuthRouter = express.Router();

AuthRouter.post('/register', Register);
AuthRouter.post('/login', Login);
AuthRouter.post('/logout',UserAuth, Logout);
AuthRouter.post('/isauthorized', UserAuth, isAuthorized);

module.exports = AuthRouter;