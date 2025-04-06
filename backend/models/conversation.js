const mongoose = require('mongoose');

const ConvoSchema = mongoose.Schema({
	userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
	conversations:[{
		conversationId: {type:String, default:"", unique:true},
		title:{type:String,default:"New Chat"},
		messages: []
	}]
},{versionKey: false});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConvoSchema);

module.exports = Conversation;