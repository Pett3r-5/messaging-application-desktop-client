import React, { useEffect, useState } from 'react';
import ChatCoverItem from './ChatCoverItem/ChatCoverItem';
import './ChatListContainer.css';


function ChatListContainer() {
  
    return (
      <div className="chat-list-container">
          <ChatCoverItem />
      </div>
      
    );
  }
  
  
  export default ChatListContainer;