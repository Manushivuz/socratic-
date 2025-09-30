
import React, { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../styles/Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Verify = ({ switchToLogin }) => {
  const [verifyotp, setVerifyOtp] = useState();
  const navigate =  useNavigate();
  const backy = process.env.REACT_APP_BACKEND_URL;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verifyotp) {
      alert("OTP field is required");
      return;
    }
    axios.post(`${backy}/api/auth/verifyotp`, 
      {recOtp: verifyotp,email: localStorage.getItem('email')}, 
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(result => {
      console.log(result)
	  alert("Account Created. Login");
      switchToLogin();
    })
    .catch(err => console.log(err));
  }    
  

  return (
    
    <div className='sign-body'> 
      <div className="form-box regi">
      <h2 className="animation" style={{ '--li': 17, '--S': 0 }}>Verify Email</h2>
	  <h4 className="animation" style={{ '--li': 17, '--S': 0 }}>Kindly Dont Close the Window</h4>
      <form onSubmit={handleSubmit}>
	  
        <div className="input-box animation" style={{ '--li': 18, '--S': 1 }}>
          <input type="text" required onChange={(e) => setVerifyOtp(e.target.value)} />
          <label>OTP</label>
          <i className='bx bxs-user'></i>
        </div>


        <div className="input-box animation" style={{ '--li': 21, '--S': 4 }}>
          <button className="btn" type="submit">Validate</button>
        </div>
        <div className="reg-link animation" style={{ '--li': 22, '--S': 5 }}>
          <p>Already have an account? <a href="#" onClick={switchToLogin} className="SignInLink">Login</a></p>
		  <p>Skip Sign-In <a href="#" onClick={
			  ()=>{
				  navigate('/Home');
			  }
		  } className="SignInLink">Login</a></p>
        </div>
      </form>
    </div>
      
    </div>
  );
};

export default Verify;

