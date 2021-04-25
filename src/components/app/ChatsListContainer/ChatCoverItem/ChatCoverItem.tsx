import React, { useEffect, useState } from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatCoverItem.css';
import { mapper } from '../../../../commons/mapper';

interface ChatConverItemProps {
  conversation: Conversation
  openConversation: Function
}

function ChatCoverItem({ conversation, openConversation }: ChatConverItemProps) {

  function openThisConversation() {
    openConversation(conversation.conversationLink)
  }
  
    return (
      <div className="chat-item" onClick={openThisConversation}>
        {!!conversation.subject ? <div>{conversation.subject}</div> : <></>}
        <div style={{fontSize: 14}}>
        {conversation.users.map((element, index)=>(<>
        {index === conversation.users.length-1 ? element.name : mapper.addComma(element.name) } 
        </>))}
        </div>
        
      </div>
      
    );
  }
  
  
  export default ChatCoverItem;