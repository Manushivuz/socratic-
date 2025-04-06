const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	otp: {type: String, default:''},
	otpexpire: {type: Number,default:0},
	verified: {type: Boolean,default:false},
	resetverified: {type: Boolean,default: false}
},{versionKey:false},);

const User = mongoose.models.User || mongoose.model('User',UserSchema);

module.exports = User;