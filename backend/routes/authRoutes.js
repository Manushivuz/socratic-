const express = require('express');
const {Register,Login,Logout} = require('../controllers/authController');
const UserAuth = require('../middleware/userAuth');

const AuthRouter = express.Router();

AuthRouter.post('/register', Register);
AuthRouter.post('/login', Login);
AuthRouter.post('/logout', UserAuth, Logout);

module.exports = AuthRouter;