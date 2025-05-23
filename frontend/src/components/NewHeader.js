import React, { useState,useEffect } from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import { FaRegLightbulb } from 'react-icons/fa'; // Correct import for FaRegLightbulb
import { FiSidebar } from 'react-icons/fi'; // Sidebar toggle icon
import axios from 'axios';
import { ReactComponent as Loader } from '../loader.svg'
import './loader.css'


import {useNavigate} from 'react-router-dom'

const backy = process.env.REACT_APP_BACKEND_URL;

function NewHeader({ toggleSidebar, isSidebarOpen,loading,setMessages }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  useEffect(() => {
    // Store the login status in localStorage whenever it changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
  },[isLoggedIn]);
  const [darkMode, setDarkMode] = useState(false);
  const navigator=useNavigate();
  const handleLogin= async ()=>{
    if (isLoggedIn) {
      // Handle Logout
      setIsLoggedIn(false);
      localStorage.setItem('isLoggedIn', 'false');
	  try{
		  axios.defaults.withCredentials = true;
		  const {data} = await axios.post(backy+'/api/auth/logout',{},{withCredentials:true});
		  if(data.message){
			setMessages([]);
			alert("Logged Out Successfully");
			navigator('/');
		  }
		  else alert("Error logging out");
	  }
	  catch(e){
		  console.log(e);
	  }
      
    } else {
      // Handle Login
      
      navigator('/login'); // Navigate to login page

    }
    
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className={`flex justify-between items-center p-4 shadow-md transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-slate-300'}`}>
      {/* Left side - Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className={`text-2xl button-hover ${darkMode ? 'text-white' : 'text-gray-700'} bg-transparent border-none`} // Added button-hover class and removed background
      >
        <FiSidebar />
      </button>

      {/* Center - Chat App Title */}
      <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
	  {loading?<Loader className="spinner" />:  <>Socratic Teaching Agent</>}
        
      </h1>

      {/* Right side - Lantern for dark mode toggle and Google login */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`text-2xl button-hover ${darkMode ? 'text-white' : 'text-gray-700'} bg-transparent border-none`} // Added button-hover class and removed background
        >
          <FaRegLightbulb className={darkMode ? 'text-yellow-500' : ''} />
        </button>
        <GoogleLoginButton onClick={handleLogin} isLoggedIn={isLoggedIn}/>
      </div>
    </div>
  );
}

export default NewHeader;
