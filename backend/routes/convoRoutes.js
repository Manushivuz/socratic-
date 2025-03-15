const express = require('express');
const {GetConvo,AddConvo,GetConvoFromId,DeleteConvoFromId} = require('../controllers/convoController');
const UserAuth = require('../middleware/userAuth');

const ConvoRouter = express.Router();

ConvoRouter.get('/getconvo', UserAuth, GetConvo);
ConvoRouter.get('/addconvo', UserAuth, AddConvo);
ConvoRouter.get('/getconvofromid', UserAuth, GetConvoFromId);
ConvoRouter.get('/deleteconvofromid', UserAuth, DeleteConvoFromId);

module.exports = ConvoRouter;