const mongoose = require('mongoose');

const uri = `mongodb+srv://shivuve:${process.env.MONGO_PWD}@socratic.xt8eb.mongodb.net/SocraticDB?retryWrites=true&w=majority&appName=Socratic`;

const client_options = {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    }
	
const ConnectDB = async ()=>{
	try{
	  await mongoose.connect(uri,client_options);
		console.log("Mongo done");
	}
	catch(e){ 
	console.log(e);
	}
}

module.exports = ConnectDB;