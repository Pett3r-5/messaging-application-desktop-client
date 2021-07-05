import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

import Conversation from '../../../models/Conversation';
import ChatCoverItem from './ChatCoverItem/ChatCoverItem';
import './ChatListContainer.css';

interface ChatListContainerProps {
  conversations: Conversation[]
  openedConversation: Conversation
}

function ChatListContainer({conversations, openedConversation }: ChatListContainerProps) {
  
    return (
      <ScrollContainer className="chat-list-container">
        {!!conversations && !openedConversation.conversationLink ? 
        conversations.map((conversation:Conversation, index)=>(
          <ChatCoverItem conversation={conversation} key={index}/>))
        : <></>}

        {!!conversations && !!openedConversation.conversationLink ? 
        conversations.map((conversation:Conversation, index)=>(
          openedConversation && conversation.conversationLink !== openedConversation.conversationLink
          ? <ChatCoverItem conversation={conversation} key={index}/>
        : <></>))
        : <></>}
          
      </ScrollContainer>
      
    );
  }
  
  
  export default ChatListContainer;