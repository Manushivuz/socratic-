
import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../styles/Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckEmail from './CheckEmail';

const SetNewPwd = ({switchToLogin,email})=>{
	const [newpassword, setNewPassword] = useState();
  const backy = process.env.REACT_APP_BACKEND_URL;

	const handlePwdSubmit = (e) => {
    e.preventDefault();
    if (!newpassword) {
      alert("New Password Field Required");
      return;
    }
    axios.post(`${backy}/api/auth/changepwd`, 
      {email:email, newpwd: newpassword}, 
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(result => {
	  if(result.data.message){
		alert("Password Changed, Re-Login");
		switchToLogin();
	  }
	  else alert(result.data.error);
    })
    .catch(err => console.log(err));
  }
  
  return (
      <div className="form-box-check">

      <form onSubmit={handlePwdSubmit}>
        <div className="input-box animation" style={{ '--D': 1, '--S': 22 }}>
          <input type="password" required onChange={(e) => setNewPassword(e.target.value)} />
          <label>New Password</label>
          <i className='bx bxs-user'></i>
        </div>
        <div className="input-box animation" style={{ '--D': 3, '--S': 24 }}>
          <button className="btn" type="submit">Confirm</button>
        </div>
      </form>
    </div>

  );
  
  
}



const ResetOtp = ({email,setisotp,setisemail,setdefault}) => {
  const [verifyotp, setVerifyOtp] = useState();
  const navigate =  useNavigate();
  const backy = process.env.REACT_APP_BACKEND_URL;

  
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!verifyotp || !email ) {
      alert("OTP field is required");
      return;
    }
    axios.post(`${backy}/api/auth/receivereset`, 
      { email: localStorage.getItem('email'),recOtp: verifyotp}, 
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(result => {
	  if(result.data.message){
		setisotp(true);
		setdefault(false);
		setisemail(false);
	  }
	  else alert(result.data.error);
	  
    })
    .catch(err => console.log(err));
  }    
  

  return (
    
      <div className="form-box-check">
      <form onSubmit={handleOtpSubmit}>
	  
        <div className="input-box animation" style={{ '--D': 1, '--S': 22 }}>
          <input type="text" required onChange={(e) => setVerifyOtp(e.target.value)} />
          <label>OTP</label>
          <i className='bx bxs-user'></i>
        </div>

        <div className="input-box animation" style={{ '--D': 3, '--S': 24 }}>
          <button className="btn" type="submit">Validate</button>
        </div>

      </form>
    </div>
      
  );
  
  
};


const Reset = ({ switchToLogin }) => {

  const navigate =  useNavigate();
  const [isemail,setisemail] = useState(false);
  const [isotp,setisotp] = useState(false);
  const [email, setEmail] = useState("");
  const [isdefault,setdefault] = useState(true);
  return (
    
    <div className="form-box Login">
	  <div id="head-reset" style={{ '--D': 0, '--S': 21 }}>
		  <h2 >Reset Password</h2>
		  <h4>Kindly dont Close the Window</h4>
	  </div>
	  {isdefault && <CheckEmail setisemail={setisemail} setEmail={setEmail} email={email}/>}

	  {isemail && <ResetOtp setisemail={setisemail} setisotp={setisotp} setEmail={setEmail} email={email} setdefault={setdefault}/>}
	  {isotp && <SetNewPwd switchToLogin={switchToLogin} email={email}/>}
        <div className="reg-link animation" style={{ '--D': 4, '--S': 25 }}>
          <p>Already have an account? <a href="#" onClick={switchToLogin} className="SignInLink">Login</a></p>
		  <p>Skip Sign-In <a href="#" onClick={
			  ()=>{
				  navigate('/Home');
			  }
		  } className="SignInLink">Back</a></p>
        </div>
      
    </div>
  );
  
};

export default Reset;

