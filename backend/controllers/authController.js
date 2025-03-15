const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
		const uservar = await User.findOne({email});
		if(uservar) return res.json({error: 'User Exists'});
		
		const hashedpwd = await bcrypt.hash(password,10);
		const newUser = new User({
			name,email,password:hashedpwd
		});
		await newUser.save();
		
		const token = jwt.sign(
		{id: newUser._id},
		process.env.JWT_SECRET,
		{expiresIn:'7d'}
		);
		
		res.cookie('token',token,{
			httpOnly: true,
			secure: process.env.NODE_ENV === 'dev'?false:true,
			sameSite: process.env.NODE_ENV === 'dev'?'strict':'none',
			maxAge: 7*24*60*60*1000
		});
		
		return res.json({message: "Register Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


const Login = async (req,res)=>{
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

		
		const token = jwt.sign(
		{id: uservar._id},
		process.env.JWT_SECRET,
		{expiresIn:'7d'}
		);
		
		res.cookie('token',token,{
			httpOnly: true,
			secure: process.env.NODE_ENV === 'dev'?false:true,
			sameSite: process.env.NODE_ENV === 'dev'?'strict':'none',
			maxAge: 7*24*60*60*1000
		});
		return res.json({message: "Login Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

const Logout = async (req,res)=>{
	try{
		res.clearCookie('token');
		return res.json({message: "Logout Success"});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}


module.exports = {Register,Login,Logout};