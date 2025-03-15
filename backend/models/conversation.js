const mongoose = require('mongoose');

const ConvoSchema = mongoose.Schema({
	userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
	conversations: [{
		conversationId: {type:String, default:""},
		messages: [{
			user: {type: String, default:""},
			ai: {type: String, default:""}
		}]
	}]
},{versionKey: false});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConvoSchema);

module.exports = Conversation;