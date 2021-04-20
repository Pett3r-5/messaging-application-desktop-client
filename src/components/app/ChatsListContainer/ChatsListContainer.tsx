import React, { useEffect, useState } from 'react';
import Conversation from '../../../models/Conversation';
import ChatCoverItem from './ChatCoverItem/ChatCoverItem';
import './ChatListContainer.css';

interface ChatListContainerProps {
  conversations: Conversation[]
}

function ChatListContainer({conversations}: ChatListContainerProps) {
  
    return (
      <div className="chat-list-container">
        {!!conversations ? 
        conversations.map((conversation, index)=><ChatCoverItem conversation={conversation} key={index}/>)
        : <></>}
          
      </div>
      
    );
  }
  
  
  export default ChatListContainer;