import React, { useEffect, useState } from 'react';
import './Chat.css';
import ChatBox from './ChatBox/ChatBox';
import ChatListContainer from './ChatsListContainer/ChatsListContainer';


function Chat() {
  
    return (
      <div className="chat-container">
          <ChatBox />
          <ChatListContainer />
      </div>
      
    );
  }
  
  
  export default Chat;