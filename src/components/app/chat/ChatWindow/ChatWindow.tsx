import React, { useEffect, useState } from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatWindow.css';
import ChatMessage from './ChatMessage/ChatMessage';
import MessageForm from './MessageForm/MessageForm';
import ChatHeader from './ChatHeader/ChatHeader';

interface ChatWindowProps {
  openedConversation: Conversation
  postMessage: Function
  userId: string
}

function ChatWindow({ openedConversation, postMessage, userId }:ChatWindowProps) {
  const [ messageContainerHeight, setMessageContainerHeight ] = useState<boolean>(false)

  useEffect(()=> {
    const regularElement = document.getElementsByClassName("messages-container");
    if(!!regularElement && regularElement.length > 0) {

      regularElement[0].scrollTop = regularElement[0].scrollHeight;
    } else {
      const smallerElement = document.getElementsByClassName("messages-container-smaller");
      if(!!smallerElement && smallerElement.length > 0) {
        smallerElement[0].scrollTop = smallerElement[0].scrollHeight;
      }
    }
  })

  const onHeaderHover = (expanded:boolean)=> {
    setMessageContainerHeight(expanded)
  }
  
    return (
      <div className="chat-window">
          <ChatHeader conversation={openedConversation} onHeaderHover={onHeaderHover}/>
          <div className={messageContainerHeight ? "messages-container-smaller"  : "messages-container" }>
            {!!openedConversation && !!openedConversation.messages ? 
            openedConversation.messages.map((message, index)=><ChatMessage message={message} userId={userId} key={index} />) 
            : <></>}
          </div>
          <MessageForm postMessage={postMessage}/>
          
      </div>
      
    );
  }
  
  
  export default ChatWindow;