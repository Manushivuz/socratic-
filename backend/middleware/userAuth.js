const jwt = require('jsonwebtoken');
var cookies = require('cookie-parser');

const UserAuth = async (req,res,next) =>{
	const {token} = req.cookies;
	if(!token){
		isloggedin = false;
		return res.json({error: "Not Authorized"});
	}	
	try{
		const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);
		const idfromtoken = decodedtoken.id;
		if(!idfromtoken) res.json({error: "Not Authorized.... corrupted token"});
		req.body.userId = idfromtoken;
		isloggedin = true;
		current_user = idfromtoken;
		next();
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

module.exports = UserAuth;