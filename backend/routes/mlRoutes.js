const {GetAiResponse} = require('../controllers/mlController');
const express = require('express');

const MLRouter = express.Router();

MLRouter.post('/getairesponse',GetAiResponse);

module.exports = MLRouter;