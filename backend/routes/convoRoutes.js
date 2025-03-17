const express = require('express');
const {GetConvo,AddConvo,GetConvoFromId,DeleteConvoFromId,GetConvoList,AddConvoFromId} = require('../controllers/convoController');
const UserAuth = require('../middleware/userAuth');

const ConvoRouter = express.Router();

ConvoRouter.get('/getconvo', UserAuth, GetConvo);
ConvoRouter.post('/addconvo', AddConvo);
ConvoRouter.post('/getconvofromid', UserAuth, GetConvoFromId);
ConvoRouter.post('/deleteconvofromid', UserAuth, DeleteConvoFromId);
ConvoRouter.post('/getconvolist', UserAuth, GetConvoList);
ConvoRouter.post('/addconvofromid', AddConvoFromId);

module.exports = ConvoRouter;