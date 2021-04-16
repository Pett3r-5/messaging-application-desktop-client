import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import ChatMessage from './ChatMessage/ChatMessage';
import MessageForm from './MessageForm/MessageForm';

interface ChatBoxProps {
  postMessage: Function
}

function ChatBox({ postMessage }:ChatBoxProps) {
  
    return (
      <div className="chat-box">
          <div style={{overflow: "auto"}}>
            <ChatMessage />
            <ChatMessage />
          </div>
          <MessageForm postMessage={postMessage}/>
          
      </div>
      
    );
  }
  
  
  export default ChatBox;