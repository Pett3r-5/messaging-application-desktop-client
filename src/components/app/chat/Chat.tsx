import React from 'react';
import Conversation from '../../../models/Conversation';
import './Chat.css';
import ChatWindow from './ChatWindow/ChatWindow';

interface ChatProps {
  openedConversation: Conversation
  postMessage: Function
  userId: string
  minimizeConversation: Function
}


function Chat({openedConversation, postMessage, userId, minimizeConversation}: ChatProps) {
  
    return (
      <div className="chat-container">
          <ChatWindow openedConversation={openedConversation} postMessage={postMessage} userId={userId} minimizeConversation={minimizeConversation}/>
      </div>
    );
  }
  
  
  export default Chat;