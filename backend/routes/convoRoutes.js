const express = require('express');
const {GetConvo,AddConvo,GetConvoFromId,DeleteConvoFromId} = require('../controllers/convoController');
const UserAuth = require('../middleware/userAuth');

const ConvoRouter = express.Router();

ConvoRouter.get('/getconvo', UserAuth, GetConvo);
ConvoRouter.post('/addconvo', UserAuth, AddConvo);
ConvoRouter.get('/getconvofromid', UserAuth, GetConvoFromId);
ConvoRouter.post('/deleteconvofromid', UserAuth, DeleteConvoFromId);

module.exports = ConvoRouter;