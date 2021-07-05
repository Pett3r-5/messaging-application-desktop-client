import React, { useContext }  from 'react';
import Conversation from '../../../../models/Conversation';
import './ChatCoverItem.css';
import { mapper } from '../../../../commons/mapper';
import Connection from '../../../../commons/Connection';
import { UserContext } from '../../App';

interface ChatConverItemProps {
  conversation: Conversation
}

function ChatCoverItem({ conversation }: ChatConverItemProps) {
  const { user } = useContext(UserContext)

  function openThisConversation() {
    Connection.getSocket().emit("get-conversation", { conversationLink: conversation.conversationLink, clientId: user?.clientId })
  }
  
    return (
      <div className="chat-item" onClick={openThisConversation}>
        <div>
          {!!conversation.subject ? <div>{conversation.subject}</div> : <></>}
          <div style={{fontSize: 14}}>
            {conversation.users.map((element, index)=>(<>
            {index === conversation.users.length-1 ? element.name : mapper.addComma(element.name) } 
            </>))}
          </div>
        </div>
        
        { !!conversation.hasNewMessage ?
           <div style={{borderRadius: 50, height: 10, width: 10, backgroundColor: "red"}}></div> :
           <></>
        }
        
      </div>
      
    );
  }
  
  
  export default ChatCoverItem;