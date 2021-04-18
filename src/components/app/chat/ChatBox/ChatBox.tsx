import React, { useEffect, useState } from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatBox.css';
import ChatMessage from './ChatMessage/ChatMessage';
import MessageForm from './MessageForm/MessageForm';

interface ChatBoxProps {
  openedConversation: Conversation
  postMessage: Function
  userId: string
}

function ChatBox({ openedConversation, postMessage, userId }:ChatBoxProps) {
  
    return (
      <div className="chat-box">
          <div style={{overflow: "auto", maxHeight:"90%"}}>
            {!!openedConversation && !!openedConversation.messages ? 
            openedConversation.messages.map((message, index)=><ChatMessage message={message} userId={userId} key={index} />) 
            : <></>}
          </div>
          <MessageForm postMessage={postMessage}/>
          
      </div>
      
    );
  }
  
  
  export default ChatBox;