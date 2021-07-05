import React from 'react';
import Conversation from '../../../models/Conversation';
import './Chat.css';
import ChatWindow from './ChatWindow/ChatWindow';

interface ChatProps {
  minimizeConversation: Function
}


function Chat({minimizeConversation}: ChatProps) {
  
    return (
      <div className="chat-container">
          <ChatWindow minimizeConversation={minimizeConversation}/>
      </div>
    );
  }
  
  
  export default Chat;