const axios = require('axios');
const jwt = require('jsonwebtoken');

const GetAiResponse = async (req,res)=>{
	const {prompt,trigger} = req.body;

	if(!isloggedin || trigger){
		current_convoId = null;
	}
	var newtrigger = false;
	if(!current_convoId){ 
		newtrigger = true;
	}
	try{
		axios.defaults.withCredentials = true;
		let {data} = await axios.post('http://127.0.0.1:5001/chatprompt', {message: prompt, trigger:newtrigger});
		
		if(!isloggedin){
			return res.json({message: data.response});
		}
		
		
		const result = data;
		if(isloggedin && current_convoId){
			axios.defaults.withCredentials = true;
			const msg = {
				"user":prompt,
				"ai":result.response
			}
			let {data} = await axios.post('http://127.0.0.1:5000/api/convo/addconvofromid',{newmsg:msg});
		}
		
		if(trigger || !current_convoId){
			const {token} = req.cookies;
			if(!token){
				isloggedin = false;
				return res.json({error: "Not Authorized"});
			}
			try{
				const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);
				const idfromtoken = decodedtoken.id;
				if(!idfromtoken) res.json({error: "Not Authorized.... corrupted token"});
				isloggedin = true;
				current_user = idfromtoken;
			
			
				axios.defaults.withCredentials = true;
				const msg = {
					"user":prompt,
					"ai":result.response
				}
				let {data} = await axios.post('http://127.0.0.1:5000/api/convo/addconvo',{newmsg:msg,userId:idfromtoken});
			}
			catch(e){
					console.log(e);
			}		
		}
		
		return res.json({message: result.response});
	}	
	
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
	
}
module.exports = {GetAiResponse};