import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import "../styles/Signup.css"
const Login = ({ switchToSignUp }) => {
const [name, setName] = useState('');
const [password, setPassword] = useState('');
const navigator =  useNavigate();

const {REACT_APP_BACKEND_URL} = process.env;



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name ||!password) {
      alert("All fields are required");
      return;
    }
    axios.post(REACT_APP_BACKEND_URL+'/login', 
      { name, password }, 
      { headers: { 'Content-Type': 'application/json' },
      withCredentials: true }
    )
    .then(result => {console.log(result.data)
      if(result.data.message === "Success") // use this for route
       {navigator('/Home')}
    })
    .catch(err => {
      alert(err)
    });
  }    


  return (
   
      <div className="form-box Login">
      <h2 className="animation" style={{ '--D': 0, '--S': 21 }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{ '--D': 1, '--S': 22 }}>
          <input type="text" required onChange={(e) => setName(e.target.value)} />
          <label>Username</label>
          <i className='bx bxs-user'></i>
        </div>
        <div className="input-box animation" style={{ '--D': 2, '--S': 23 }}>
          <input type="password" required onChange={(e) => setPassword(e.target.value)} />
          <label>Password</label>
          <i className='bx bx-lock-alt'></i>
        </div>
        <div className="input-box animation" style={{ '--D': 3, '--S': 24 }}>
          <button className="btn" type="submit">Login</button>
        </div>
        <div className="reg-link animation" style={{ '--D': 4, '--S': 25 }}>
          <p>Don't have an account? <a href="#" onClick={switchToSignUp} className="SignUpLink">SignUp</a></p>
        </div>
      </form>
    </div>
    
    
  );
};

export default Login;
