import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import ChatMessage from './ChatMessage/ChatMessage';
import InputMessage from './InputMessage/InputMessage';


function ChatBox() {
  
    return (
      <div className="chat-box">
          <div style={{overflow: "auto"}}>
            <ChatMessage />
            <ChatMessage />
          </div>
          
          <InputMessage />
      </div>
      
    );
  }
  
  
  export default ChatBox;