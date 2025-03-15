const mongoose = require('mongoose');

const ConvoSchema = mongoose.Schema({
	userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
	conversations:[{
		conversationId: {type:String, default:"", unique:true},
		messages: []
	}]
},{versionKey: false});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConvoSchema);

module.exports = Conversation;