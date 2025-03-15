const axios = require('axios');

const GetAiResponse = async (req,res)=>{
	const {prompt} = req.body;
	try{
		axios.defaults.withCredentials = true
		const {data} = await axios.post('http://127.0.0.1:5001/mlprompt', {message: prompt});
		console.log(data.response);
		return res.json({message: data.response});
	}
	catch(e){
		console.log(e);
		return res.json({error: e.message});
	}
	
}
module.exports = {GetAiResponse};