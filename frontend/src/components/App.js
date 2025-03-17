import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios for API calls
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow'; // Import ChatWindow component
import MessageInput from './MessageInput'; // Import MessageInput component
import NewHeader from './NewHeader';
import '../styles/home.css';
import '../styles/chatWindow.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [addconvotrigger, setaddconvotrigger] = useState(false);
  const backy = process.env.REACT_APP_BACKEND_URL;
  const [chatbox,setchatbox] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim() !== '') {
      const userMessage = { sender: 'user', text: newMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
  
      // Make a POST request to the backend API
      setLoading(true); // Set loading to true while waiting for response
      axios.post(backy+'/api/ml/getairesponse', 
	  { prompt: newMessage, trigger: addconvotrigger},
	  { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        .then((response) => {
          const aiResponse = { sender: 'ai', text: response.data.message };
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
  
          // You can update the chat list or handle any additional logic here
          updateChatList(newMessage);
        })
        .catch((error) => {
          console.error('Error fetching AI response:', error);
          const aiResponse = { sender: 'ai', text: 'Sorry, something went wrong.' };
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
        })
        .finally(() => {
          setLoading(false); // Reset loading state
        });
    }
  };
  

  const updateChatList = () => {
    loadPreviousChats();
  };

  const loadPreviousChats = async () => {
    setLoading(true); // Set loading to true while fetching chats
	try{
		
		axios.defaults.withCredentials = true;
		axios(backy+'/api/convo/getconvolist', {
		  method: 'POST',
		  withCredentials: true
		}).then(res => {
			 if(res.data.message) setPreviousChats(res.data.message);
		   }).catch(err => {
			 console.log(err.response);
		   })
		/*axios.defaults.withCredentials = true;
		const {data} = await axios.post(backy+'/api/convo/getconvolist',{withCredentials:true});
		console.log("in loadprev chats: ",data);
		if(data.message) setPreviousChats(data.message);*/
	}
	catch(e){
		console.log(e);
	}
	setLoading(false); 
  };

  useEffect(() => {
    loadPreviousChats();
  }, []);

  const displayFullChat = async (chatId) => {
	setaddconvotrigger(false);
	
	setchatbox(true);
	
    setCurrentConversationId(chatId); // Set the current conversation ID
	try{
		axios.defaults.withCredentials = true;
		const {data} = await axios.post(backy+'/api/convo/getconvofromid', {convoId:chatId},{withCredentials:true});
		if(data.message){
		const formattedMessages = data.message.map(entry => [
          { sender: 'user', text: entry.user }, // Format for the user message
          { sender: 'ai', text: entry.ai },     // Format for the AI response
        ]).flat();

        // Set the formatted messages in the state
        setMessages(formattedMessages);
		}
	}
	catch(e){
		console.log(e);
	}
  /*  axios.get(backy+`/api/convo/getconvofromi`, {convoId:chatId},{ headers: { 'Content-Type': 'application/json' }},
	{ withCredentials: true })
      .then(response => {
        // Extract the conversation messages
		console.log("Message : ",response.data);
        const formattedMessages = response.data.message.map(entry => [
          { sender: 'user', text: entry.user }, // Format for the user message
          { sender: 'ai', text: entry.ai },     // Format for the AI response
        ]).flat();

        // Set the formatted messages in the state
        setMessages(formattedMessages);
      })
      .catch(error => {
        console.error('Error loading chat:', error);
      }); */
}


const handleNewConversation = () => {
	setMessages([]);
	setaddconvotrigger(true);
	setchatbox(true);
	
};

  // Function to handle chat deletion
  const handleDeleteChat = (chatId) => {
    axios.post(backy+`/api/convo/deleteconvofromid`,{convoId: chatId}, { withCredentials: true })
      .then(() => {
        // Update the sidebar by filtering out the deleted conversation
        setPreviousChats((prevChats) => prevChats.filter(chat => chat.convoId !== chatId));
      })
      .catch((error) => {
        console.error('Error deleting chat:', error);
      });
};


  return (
    <div className='home-body'>
      <div className="flex flex-col h-screen">
      <NewHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-grow relative overflow-hidden" id="chatWindowid1">
        <div
          className={`transition-transform duration-1000 ease-in-out h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-10 absolute`}
          id = "sidebarcheck" style={{ width: '250px' }}
        >
          <Sidebar 
            previousChats={previousChats} 
            onChatClick={displayFullChat} 
            onNewChat={handleNewConversation} 
            onDeleteChat={handleDeleteChat}  // Pass the delete handler
          />
        </div>

        <div
          className={`flex-grow transition-all duration-1000 ease-in-out flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
          style={{
            marginLeft: isSidebarOpen ? '250px' : '0',
          }}
        >
          <div className="flex flex-col flex-grow h-full min-h-0" id="chatWindowid1">
            <ChatWindow messages={messages} loading={loading} /> {/* Pass loading state to ChatWindow */}
			{chatbox && <MessageInput isSidebarOpen={isSidebarOpen,chatbox,setchatbox} onSendMessage={handleSendMessage} />}
            
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

export default App;
