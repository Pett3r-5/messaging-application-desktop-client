import React, { useEffect, useState } from 'react';
import './Chat.css';
import ChatBox from './ChatBox/ChatBox';
import ChatListContainer from './ChatsListContainer/ChatsListContainer';

interface ChatProps {
  postMessage: Function
}


function Chat({postMessage}: ChatProps) {
  
    return (
      <div className="chat-container">
          <ChatBox postMessage={postMessage}/>
          <ChatListContainer />
      </div>
      
    );
  }
  
  
  export default Chat;