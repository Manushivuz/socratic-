const express = require('express');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const ConnectDB = require('./config/db');
const AuthRouter = require('./routes/authRoutes');


app.use(express.json());
app.use(cookieParser());
	cors({
		credentials: true,
		origin: ['http://localhost:3000']
	})
	
ConnectDB();
console.log("Line 20"+process.env.MONGO_PWD);


app.use('/api/auth/',AuthRouter);


app.get('/',(req,res)=>{
	res.send("THis is index/landing");
});


app.listen(5000,()=>{
	console.log("Listenin at 5k");

});