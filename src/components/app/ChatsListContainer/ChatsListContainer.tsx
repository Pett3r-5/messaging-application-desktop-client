import React, { useEffect, useState } from 'react';
import Conversation from '../../../models/Conversation';
import ChatCoverItem from './ChatCoverItem/ChatCoverItem';
import './ChatListContainer.css';

interface ChatListContainerProps {
  conversations: Conversation[]
  openedConversation: Conversation
  openConversation: Function
}

function ChatListContainer({conversations, openedConversation, openConversation }: ChatListContainerProps) {
  
    return (
      <div className="chat-list-container">
        {!!conversations && !openedConversation.conversationLink ? 
        conversations.map((conversation:Conversation, index)=>(
          <ChatCoverItem conversation={conversation} openConversation={openConversation} key={index}/>))
        : <></>}

        {!!conversations && !!openedConversation.conversationLink ? 
        conversations.map((conversation:Conversation, index)=>(
          openedConversation && conversation.conversationLink !== openedConversation.conversationLink
          ? <ChatCoverItem conversation={conversation} openConversation={openConversation} key={index}/>
        : <></>))
        : <></>}
          
      </div>
      
    );
  }
  
  
  export default ChatListContainer;