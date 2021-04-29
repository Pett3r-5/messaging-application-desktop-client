import React, { useEffect, useState } from 'react';
import Conversation from '../../../../../models/Conversation';
import './ChatHeader.css';
import { mapper } from '../../../../../commons/mapper'
const downArrow = require('../../../../../assets/PinClipart.com_zip-clipart_2015963.png').default

interface ChatHeaderProps {
    conversation: Conversation
    onHeaderHover: Function
}

function ChatHeader({ conversation, onHeaderHover }: ChatHeaderProps) {
    const [showContent, setShowContent] = useState<boolean>(false)

    const handleMouseOver = () => {
        setShowContent(true)
        onHeaderHover(true)
    }

    const handleMouseOut = () => {
        setShowContent(false)
        onHeaderHover(false)
    }

    if (!!conversation) {
        return (
            <div className="chat-header" onMouseOver={handleMouseOver} onMouseLeave={handleMouseOut}>
                <div>
                    {showContent && !!conversation.subject ? 
                    <div className="chat-subject"><p className="chat-subject-paragraph">{conversation.subject}</p></div> 
                    : <></>}
                </div>
                <div className="chat-header-content">
                    <div className="chat-link">
                        <div>Link do chat:</div>
                        <div className="chat-link-uuid">{showContent ? conversation.conversationLink : ""}</div>
                    </div>
                    {!showContent ? 
                        <div>
                        <img style={{height:10, margin: "auto"}} src={downArrow} />
                        </div>
                    : <div><b>{!!conversation.isPublic? "público" : "particular"}</b></div>}
                    
                    <div className="chat-users">
                        { !!conversation && !!conversation.users ?
                            conversation.users.map((element, index) => (<>
                                {index === conversation.users.length - 1 ? element.name : mapper.addComma(element.name)}
                            </>))
                            : <></>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return <div className="chat-header"></div>

}

export default ChatHeader