import React from 'react';
import Conversation from '../../../models/Conversation';
import './Chat.css';
import ChatWindow from './ChatWindow/ChatWindow';

interface ChatProps {
  openedConversation: Conversation
  postMessage: Function
  userId: string
}


function Chat({openedConversation, postMessage, userId}: ChatProps) {
  
    return (
      <div className="chat-container">
          <ChatWindow openedConversation={openedConversation} postMessage={postMessage} userId={userId}/>
      </div>
    );
  }
  
  
  export default Chat;