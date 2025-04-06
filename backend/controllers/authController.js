const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const transporter = require('../config/nodemailer');

current_user = null;

const tokenoptions = {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 7*24*60*60*1000
		}

const Register = async (req,res)=>{
	const {name,email,password} = req.body;
	if(!name){
		return res.json({error: 'Missing name'});
	}
	if(!email){
		return res.json({error: 'Missing email'});
	}
	if(!password){
		return res.json({error: 'Missing password'});
	}
	
	try{
		console.log("Enter register");
		const uservar = await User.findOne({email});
		if(uservar){
			if(uservar.verified === false){
				console.log("User already found, not verified, hence deleting....");
				await User.deleteOne({email:email});
			}
			else return res.json({error: 'User Exists'});
		}
		const uservar1 = await User.findOne({name});
		if(uservar1) return res.json({error: 'Name Exists'});
		
		const hashedpwd = await bcrypt.hash(password,10);
		const verifyotp = String(Math.floor(1111+Math.random()*1111));
		const otpexpire = Date.now()+5*60*1000;
		const newUser = new User({
			name,email,password:hashedpwd,otp:verifyotp,otpexpire
		});
		await newUser.save();
		console.log("Saved user det, email: ",email);
		console.log("Sender email: ",process.env.SENDER_EMAIL);
		const mailOptions ={
			from: process.env.SENDER_EMAIL,
			to: email,
			subject: "Verify your email",
			text: ` OTP: ${verifyotp}. Dear ${name} , This email is generated to verify your email for new account creation for the corresponding email address ${email}.`
		}
		console.log("transporter thing");
		await transporter.sendMail(mailOptions);
		return res.json({message: "Verify OTP sent"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const VerifyOtp = async (req,res)=>{
	const {recOtp,email} = req.body;
	const uservar = await User.findOne(
		{email:email}
	);
	if(!uservar) return res.json({error: "Couldnt Validate"});
	const deleteuser = async ()=>{
		await User.deleteOne({email:email});
	}
	
	if(!recOtp) {
		return res.json({error: "OTP field empty"});
	}
	try{
		if(recOtp !== uservar.otp){
			return res.json({error: "Wrong OTP"});
		}
		if(uservar.otpexpire<Date.now()){
			deleteuser();
			return res.json({error: "OTP expired"});
		}
		uservar.otp = '';
		uservar.otpexpire =0;
		uservar.verified = true;
		await uservar.save();
		return res.json({message: "Verification Success"});	
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


const SendResetOtp = async(req,res)=>{
	const {email} = req.body;
	const uservar = await User.findOne({email:email});
	if(!uservar) return res.json({error: "User not authorized"});
	
	try{
		const verifyotp = String(Math.floor(1111+Math.random()*1111));
		const otpexpire = Date.now()+5*60*1000;
		const mailOptions ={
			from: process.env.SENDER_EMAIL,
			to: uservar.email,
			subject: "Reset Passwotd",
			text: ` OTP: ${verifyotp}. Dear ${uservar.name} , This email is generated to reset your password for the corresponding email address ${uservar.email}.`
		}
		await User.updateOne(
			{email: uservar.email},
			{$set: {"otp":verifyotp, "otpexpire": otpexpire}}
		);
		console.log("transporter thing");
		await transporter.sendMail(mailOptions);
		return res.json({message: "Reset OTP sent"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const VerifyResetOtp = async (req,res)=>{
	const {email,recOtp} = req.body;
	const uservar = await User.findOne({email:email});
	if(!uservar) return res.json({error: "User not authorized"});
	
	if(!recOtp) {
		return res.json({error: "OTP field empty"});
	}
	try{
		if(recOtp !== uservar.otp){
			return res.json({error: "Wrong OTP"});
		}
		if(uservar.otpexpire<Date.now()){
			uservar.resetverified = false;
			await uservar.save();
			return res.json({error: "OTP expired"});
		}
		uservar.otp = '';
		uservar.otpexpire =0;
		uservar.resetverified = true;
		await uservar.save();
		return res.json({message: "Verification Success"});	
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


const ChangePwd = async (req,res)=>{
	const {email,newpwd} = req.body;
	const uservar = await User.findOne({email:email});
	if(!uservar){
		console.log("Usr not found");
		console.log("Email received: ",email);
		console.log("Password received: ",newpwd);
		return res.json({error: "User not authorized"});
	}
	
	
	if(!newpwd) {
		return res.json({error: "Password field empty"});
	}
	if(!uservar.resetverified) {
		return res.json({error: "OTP not done"});
	}
	try{
		const hashedpwd = await bcrypt.hash(newpwd,10);
		uservar.password = hashedpwd;
		uservar.resetverified = false;
		await uservar.save();
		return res.json({message: "Password Change Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


const Login = async (req,res)=>{
	console.log("Login called");
	const {name,password} = req.body;
	if(!name){
		return res.json({error: 'Missing name'});
	}
	if(!password){
		return res.json({error: 'Missing password'});
	}
	
	try{
		const uservar = await User.findOne({name});
		if(!uservar) return res.json({error: 'User Not Found'});
		if(uservar.verified === false) {
			console.log("User already found, not verified, hence deleting....");
			await User.deleteOne({name:name});
			return res.json({error: 'Account Not Verified'});
		}
		const issame = await bcrypt.compare(password,uservar.password);
		console.log("issame: ",issame);
		if(!issame){
			console.log("uservar pwd: ",uservar.password);
			return res.json({error: 'Wrong password'});
		}
		
		const token = jwt.sign(
		{id: uservar._id},
		process.env.JWT_SECRET,
		{expiresIn:'7d'}
		);
		
		res.cookie('token',token,tokenoptions);
		console.log("Login done, token: ");
		isloggedin = true;
		current_user = uservar._id;
		return res.json({message: "Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
} 

const Logout = async (req,res)=>{
	console.log("/LOGOUT GET");
	try{
		res.clearCookie('token');
		isloggedin = false;
		current_user = null;
		current_convoId = null;
		return res.json({message: "Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const isAuthorized = async(req,res)=>{
	try{
		return res.json({message: true});
	}
	catch(e){
		console.log(e);
		return res.json({message: false});
	}
}

const CheckEmail = async(req,res)=>{
	const {email} = req.body;
	try{
		const check = await User.findOne(
			{email:email}
		);
		if(!check) return res.json({message: false});
		return 	res.json({message: true});
	}
	catch(e){
		console.log(e);
		return res.json({error: false});
	}
}






module.exports = {Register,Login,Logout,isAuthorized,VerifyOtp,SendResetOtp,VerifyResetOtp,ChangePwd,CheckEmail};


