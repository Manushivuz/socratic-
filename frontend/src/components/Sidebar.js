import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Loader } from '../loader.svg'
import './loader.css'


const Sidebar = ({ previousChats, onChatClick, onNewChat, onDeleteChat,loading,setLoading}) => {
  return (
    <div className="h-full bg-gray-200 dark:bg-gray-900 shadow-md p-4 relative" id="sidebarcheck">
      <p className="text-gray-800 dark:text-white" id="sidebartext">Previous Chats</p>
      <button
        onClick={()=>{
			setLoading()
			setTimeout(()=>{onNewChat()},1000);
			}}
        className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
		<FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
      <ul>
		{console.log("prev chats: ",previousChats)}
        {previousChats.length > 0 ? (
          previousChats.map((chat) => (
		  
            <li key={chat.convoId} className="flex justify-between items-center">
              <button
                className="w-full text-left py-2 px-4 border-b border-gray-300 dark:border-gray-700"
				id="buttonformargin"
                onClick={() => {
						setLoading()
						setTimeout(()=>{onChatClick(chat.convoId)},1000);
				   }
					}
              >
                {chat.messages || 'Empty Conversation'}
              </button>
              <button
                className="text-red-500 hover:opacity-55 p-2"
				id="buttonformargin"
                onClick={() => {
					setLoading()
					setTimeout(()=>{onDeleteChat(chat.convoId)},1000);	
					}
				}
              >
			  
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </li>
          ))
        ) : (
          <li>
            <p className="py-2 px-4 text-gray-600 dark:text-gray-400">
			{localStorage.getItem('isLoggedIn')==="false"?
				<>Login For Chat Backup</>:
				<>No previous chats available. Create one.</>
			}
			
			</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;




/*import { ReactComponent as Loader } from '../../assets/icons/loader.svg'

const Button = ({ onSubmit, text, loading = false, disabled }) => {
  return (
    <button className="submit-btn" onClick={onSubmit} disabled={disabled}>
      {!loading ? text : <Loader className="spinner" />}
    </button>
  )
}

export default Button*/