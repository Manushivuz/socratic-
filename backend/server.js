const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:3000']
	})
);

app.get('/',(req,res)=>{
	res.send("THis is index/landing");
});


app.listen(5000,()=>{
	console.log("Listenin at 5k");

});