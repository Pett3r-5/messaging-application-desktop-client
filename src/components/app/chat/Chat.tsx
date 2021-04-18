import React, { useEffect, useState } from 'react';
import Conversation from '../../../models/Conversation';
import './Chat.css';
import ChatBox from './ChatBox/ChatBox';
import ChatListContainer from './ChatsListContainer/ChatsListContainer';

interface ChatProps {
  openedConversation: Conversation
  postMessage: Function
  userId: string
}


function Chat({openedConversation, postMessage, userId}: ChatProps) {
  
    return (
      <div className="chat-container">
          <ChatBox openedConversation={openedConversation} postMessage={postMessage} userId={userId}/>
          <ChatListContainer />
      </div>
      
    );
  }
  
  
  export default Chat;