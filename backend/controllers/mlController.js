const axios = require('axios');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/conversation');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

msgcount =0
settitle = false
const GetAiResponse = async (req,res)=>{
	const {prompt,trigger,userId,convoId} = req.body;
	console.log("msgcount: ",msgcount,"current convo: ",current_convoId);
	try{
		if(!trigger){
			axios.defaults.withCredentials = true;
			let {data} = await axios.post('http://127.0.0.1:5001/chatprompt', {message: prompt});
			const result = data;
			
			console.log("Adding convo from id, id:",userId);
			axios.defaults.withCredentials = true;
			const msg = {
				"user":prompt,
				"ai":result.response
			}
			{
				let {data} = await axios.post('http://127.0.0.1:5000/api/convo/addconvofromid',{newmsg:msg,convoId:convoId});
			}
				if(msgcount==2 || msgcount==3){
					msgcount =0;
					const istitlepresent = await Conversation.findOne(
					{'conversations.title':"New Chat"}
					);
					if(istitlepresent){
						console.log("Title is still NEW CHAT");
						const allconvos = await Conversation.aggregate([ 
							{$match: {userId: new ObjectId(userId), 'conversations.conversationId':convoId}}, 
							{$group: {_id:"$userId",
							convos: {$push: 
							{convoId: "$conversations.conversationId",messages: "$conversations.messages"}}}},
						]);
						
						console.log("Generating title");
						let {data} = await axios.post('http://127.0.0.1:5001/gettitle', {message:allconvos[0].convos[0].messages[0]});
						console.log("New title: ",data.title);
						await Conversation.updateOne(
							{'conversations.conversationId':convoId},
							{$set: {'conversations.$.title':data.title}}
						);
					}
					console.log("Title updated");
				}
			msgcount+=1;
			return res.json({message: result.response});
		}
		
		if(trigger){
			axios.defaults.withCredentials = true;
			let {data} = await axios.post('http://127.0.0.1:5001/chatprompt', {message: prompt,trigger:trigger});
			const result = data;
			console.log("Creating new chat, id:",userId);
			
			try{			
				axios.defaults.withCredentials = true;
				const msg = {
					"user":prompt,
					"ai":result.response
				}
				let {data} = await axios.post('http://127.0.0.1:5000/api/convo/addconvo',{newmsg:msg,userId:userId});
				settitle=true
				msgcount =1
				return res.json({message: result.response,convoId: data.convoId});
			}
			catch(e){
					console.log(e);
			}		
		}
	}	
	
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
	
}

const GetOfflineAiResponse = async (req,res)=>{
	const {prompt,trigger} = req.body;

	try{
		axios.defaults.withCredentials = true;
		let {data} = await axios.post('http://127.0.0.1:5001/getbotres', {message: prompt,trigger:trigger});
		return res.json({message: data.response});
	}	
	
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
	
}


module.exports = {GetAiResponse,GetOfflineAiResponse};