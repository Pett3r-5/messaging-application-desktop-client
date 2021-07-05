import React, { useContext, useEffect } from 'react';
import Message from '../../../../../models/Message';
import { UserContext } from '../../../App';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useContext(UserContext)

  if(!!message && !!message.sentBy && !!user?.clientId) {
    return (
      <div className={message.sentBy.clientId===user?.clientId ? "own-message" : "others-message"}>
        <div className="message-detail">
          {message.sentBy?.name} disse:
        </div>
        <div className={message.sentBy.clientId===user?.clientId ? "own-message-content" : "others-message-content"}>
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