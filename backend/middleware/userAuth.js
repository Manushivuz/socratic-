const jwt = require('jsonwebtoken');


const UserAuth = async (req,res,next) =>{
	const {token} = req.cookies;
	if(!token) return res.json({error: "Not Authorized"});
	try{
		const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);
		const idfromtoken = decodedtoken.id;
		if(!idfromtoken) res.json({error: "Not Authorized.... corrupted token"});
		req.body.userId = idfromtoken;
		next();
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
}

module.exports = UserAuth;