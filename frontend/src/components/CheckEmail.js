import axios from 'axios';
import './check.css';
import React, { useState,useEffect } from 'react';

const CheckEmail = ({setisemail,email,setEmail})=>{
	const [showemailbutton,setseb] = useState(true);
	const handleEmailSubmit = (e) => {
	setseb(false);
    e.preventDefault();
    if (!email) {
      alert("Email Field Required");
      return;
    }
    axios.post('http://localhost:5000/api/auth/checkemail', 
      {email}, 
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(result => {
	  localStorage.setItem('email',email);
      if(result.data.message === true){
		  setisemail(true);
		  axios.post('http://localhost:5000/api/auth/sendreset', 
			  {email}, 
			  { headers: { 'Content-Type': 'application/json' } }
			)
			.then(result => {
			  if(result.data.message){
				  console.log(result.data.message);
			  }
			  else{
				  setseb(true);
				  alert("User not found");
			  }
			})
			.catch(err => console.log(err));
		  }
	  
	  else alert("User not found");
    })
    .catch(err => console.log(err));
  }
  
  
  return (
    
    <div className="form-box-check">

      <form onSubmit={handleEmailSubmit}>
        <div className="input-box animation" style={{ '--D': 1, '--S': 22 }}>
          <input type="email" required onChange={(e) => setEmail(e.target.value)} />
          <label>Email</label>
          <i className='bx bxs-user'></i>
        </div>
        {showemailbutton && <div className="input-box animation" style={{ '--D': 3, '--S': 24 }}>
          <button className="btn" type="submit">Confirm</button>
        </div>}
      </form>
    
      
    </div>
  );
  
  
}

export default CheckEmail;