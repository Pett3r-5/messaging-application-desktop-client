import React, { useEffect, useState } from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatCoverItem.css';

interface ChatConverItemProps {
  conversation: Conversation
  openConversation: Function
}

function ChatCoverItem({ conversation, openConversation }: ChatConverItemProps) {
  function addComma(name:string){
    return (`${name}, `)
  }

  function openThisConversation() {
    openConversation(conversation.conversationLink)
  }
  
    return (
      <div className="chat-item" onClick={openThisConversation}>
        {!!conversation.subject ? <div>conversation.subject</div> : <></>}
        <div>
        {conversation.users.map((element, index)=>(<>
        {index === conversation.users.length-1 ? element.name : addComma(element.name) } 
        </>))}
        </div>
        
      </div>
      
    );
  }
  
  
  export default ChatCoverItem;