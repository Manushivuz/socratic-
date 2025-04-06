const express = require('express');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const ConnectDB = require('./config/db');
const AuthRouter = require('./routes/authRoutes');
const ConvoRouter = require('./routes/convoRoutes');
const MLRouter = require('./routes/mlRoutes');
const current_convo = null;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
		credentials: true,
		origin: ['http://localhost:3000','https://socratic-learning.onrender.com'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	}));
	
ConnectDB();

app.use('/api/auth/',AuthRouter);
app.use('/api/convo/',ConvoRouter);
app.use('/api/ml/',MLRouter);

app.get('/',(req,res)=>{
	res.send("Mone ga ga ganiga");
});


app.listen(5000,()=>{
	console.log("Listenin at 5k");

});