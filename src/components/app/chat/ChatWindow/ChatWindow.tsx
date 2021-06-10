import { useContext, useEffect, useState } from 'react';
import './ChatWindow.css';
import ChatMessage from './ChatMessage/ChatMessage';
import MessageForm from './MessageForm/MessageForm';
import ChatHeader from './ChatHeader/ChatHeader';
import { OpenedConversationContext } from '../../App';
import React from 'react';

interface ChatWindowProps {
  minimizeConversation: Function
}

function ChatWindow({ minimizeConversation }:ChatWindowProps) {

  const { openedConversation } = useContext(OpenedConversationContext)
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
          <ChatHeader onHeaderHover={onHeaderHover} minimizeConversation={minimizeConversation}/>
          <div className={messageContainerHeight ? "messages-container-smaller"  : "messages-container" }>
            {!!openedConversation && !!openedConversation.messages ? 
            openedConversation.messages.map((message, index)=><ChatMessage message={message} key={index} />) 
            : <></>}
          </div>
          <MessageForm/>
          
      </div>
      
    );
  }
  
  
  export default ChatWindow;