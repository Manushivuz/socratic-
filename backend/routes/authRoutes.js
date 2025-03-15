const express = require('express');
const {Register} = require('../controllers/authController');

const AuthRouter = express.Router();

AuthRouter.post('/register', Register);

module.exports = AuthRouter;