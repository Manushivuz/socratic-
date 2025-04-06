import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Verify from './Verify';
import Reset from './Reset';
import '../styles/Signup.css';

const LoginApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [verifyWindow,setVerifyWindow] = useState(false);
  const [resetWindow,setResetWindow] = useState(false);
  
  const switchToSignUp = () => {
    setIsLogin(false);
  };
  
  const switchToVerify = () => {
    setIsLogin(false);
	setVerifyWindow(true);
  };
  
  const switchToReset = () => {
	setVerifyWindow(false);
	setResetWindow(true);
  };

  const switchToLogin = () => {
	setResetWindow(false);
    setIsLogin(true);
	
  };

  return (
    <div className='sign-body'>
      <div className={`container ${!isLogin ? 'active' : ''}`}>
      <div className="curved-shape"></div>
      <div className="curved-shape2"></div>
      {isLogin ? (
		   resetWindow ? (
	  <Reset switchToLogin={switchToLogin} />
			):(
			<Login switchToSignUp={switchToSignUp} switchToReset={switchToReset} />
			)
		 
		  
      ) : (
	   verifyWindow ? (
			<Verify switchToLogin={switchToLogin}/>
	   ):
	    (
        <Signup switchToLogin={switchToLogin} switchToVerify={switchToVerify}/>
		)
	   
      )}
    </div>
    </div>
  );
};

export default LoginApp;

