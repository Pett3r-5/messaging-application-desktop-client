import React, { useEffect, useState } from 'react';
import Message from '../../../../../models/Message';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message
  userId: string
}

function ChatMessage({message, userId}: ChatMessageProps) {

  if(!!message && !!message.sentBy && !!userId) {
    return (
      <div className={message.sentBy.clientId===userId ? "own-message" : "others-message"}>
        <div className="message-detail">
          {message.sentBy?.name} disse:
        </div>
        <div className="message-content">
          {message.content}
        </div>
        <div className="message-detail">
          em {new Intl.DateTimeFormat('pt-BR').format(new Date(String(message.createdAt)))}
        </div>
        
      </div>
  );
  }
    return <></>
  }
  
  
  export default ChatMessage;