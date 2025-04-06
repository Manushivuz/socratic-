const {GetAiResponse,GetOfflineAiResponse} = require('../controllers/mlController');
const UserAuth = require('../middleware/userAuth');
const express = require('express');

const MLRouter = express.Router();

MLRouter.post('/getairesponse',UserAuth,GetAiResponse);
MLRouter.post('/getofflineres',GetOfflineAiResponse);

module.exports = MLRouter;