const Conversation = require('../models/conversation');
const User = require('../models/User');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const GetConvo = async (req,res)=>{
	const {userId} = req.body;
	try{
		const allconvos = await Conversation.aggregate([ 
			{$match: {userId: new ObjectId(userId)}}, 
			{$group: {_id:"$userId",
			convos: {$push: 
			{convoId: "$conversations.conversationId",messages: "$conversations.messages"}}}},
		]);
		return res.json({message: allconvos[0]});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const DeleteConvoFromId = async (req,res)=>{
	const {userId,convoId} = req.body;
	
	const checkid = convoId.slice(0,24) === userId;
	if(!checkid){
		console.log(convoId.slice(0,24));
		console.log(userId);
		return res.json({error: "Unauthorized"});
	}
	
	try{
		await Conversation.deleteOne(
			{'conversations.conversationId': convoId},
		);
		return res.json({message: "Convo deleted"});
	}
	
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


const GetConvoFromId = async (req,res)=>{
	
	const {userId,convoId} = req.body;
	if(!convoId) return res.json({error: "Convoid missin"});
	
	const checkid = convoId.slice(0,24) === userId;
	if(!checkid) return res.json({error: "Unauthorized"});
	
	const checkconvoid = await Conversation.findOne({'conversations.conversationId':convoId});
	if(!checkconvoid) return res.json({error: "ConvoId not found"});
	try{
		const allconvos = await Conversation.aggregate([ 
			{$match: {userId: new ObjectId(userId), 'conversations.conversationId':convoId}}, 
			{$group: {_id:"$userId",
			convos: {$push: 
			{convoId: "$conversations.conversationId",messages: "$conversations.messages"}}}},
		]);
		return res.json({message: allconvos[0].convos[0].messages[0]});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const AddConvo = async(req,res)=>{
	const {userId,convoId,newmsg} = req.body;
	
	try{
		if(convoId){
			const existsConvoId = await Conversation.findOne(
				{"conversations.conversationId": convoId}
			);

			if(existsConvoId){
				await Conversation.updateOne(
					{"conversations.conversationId": convoId},
					{$push: {"conversations.$.messages": newmsg}}
				);
				return res.json({message: "Convo saved at existing id"});
			}
		}
		
		const existsUserId = await Conversation.findOne(
			{userId: userId}
		);
		
		const newconvoid = `${userId}:${Date.now()}`;
		const newconvo = new Conversation({
			userId: userId,
			conversations: {
				conversationId: newconvoid,
				messages: newmsg
			}
		});
		await newconvo.save();
		return res.json({message: "Convo saved"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
	
}


module.exports = {GetConvo,AddConvo,GetConvoFromId,DeleteConvoFromId};


