const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
		const uservar = await User.findOne({email});
		if(uservar) return res.json({error: 'User Exists'});
		
		const hashedpwd = await bcrypt.hash(password,10);
		const newUser = new User({
			name,email,password:hashedpwd
		});
		await newUser.save();
		
		return res.json({message: "Register Success"});
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

		const issame = await bcrypt.compare(password,uservar.password);
		console.log("issame: ",issame);
		if(!issame) return res.json({error: 'Wrong password'});
		
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



module.exports = {Register,Login,Logout,isAuthorized};


