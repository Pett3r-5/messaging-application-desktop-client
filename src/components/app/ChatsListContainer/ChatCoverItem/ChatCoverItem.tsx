import React, { useEffect, useState } from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatCoverItem.css';

interface ChatConverItemProps {
  conversation: Conversation
}

function ChatCoverItem({conversation}: ChatConverItemProps) {
  
    return (
      <div className="chat-item">
        {conversation.users.map(element=><>{element.name}</>)}
      </div>
      
    );
  }
  
  
  export default ChatCoverItem;