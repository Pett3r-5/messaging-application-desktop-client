import React, { useEffect, useState } from 'react';
import Conversation from '../../../../../models/Conversation';
import './ChatHeader.css';
import { mapper } from '../../../../../commons/mapper'
import { Redirect } from 'react-router';
const downArrow = require('../../../../../assets/PinClipart.com_zip-clipart_2015963.png').default
const minimize = require('../../../../../assets/minimize.svg').default

interface ChatHeaderProps {
    conversation: Conversation
    onHeaderHover: Function
    minimizeConversation: Function
}

function ChatHeader({ conversation, onHeaderHover, minimizeConversation }: ChatHeaderProps) {
    const [showContent, setShowContent] = useState<boolean>(false)

    const handleMouseOver = () => {
        setShowContent(true)
        onHeaderHover(true)
    }

    const handleMouseOut = () => {
        setShowContent(false)
        onHeaderHover(false)
    }

    const minimizeChat = ()=> {
        minimizeConversation()
    }

    if (!!conversation) {
        return (
            <div className="chat-header" onMouseOver={handleMouseOver} onMouseLeave={handleMouseOut}>
                <div className="chat-header-content">
                    <div className="chat-first-row-width" style={{marginLeft: 10}}></div>
                    {showContent && !!conversation.subject ? 
                    <div className="chat-subject chat-first-row-width" >
                        <p className="chat-subject-paragraph">{conversation.subject}</p>
                    </div> 
                    : <></>}
                    <div className="chat-first-row-width" id="minimize-icon-container">
                            <img src={minimize} id="minimize-icon-image" onClick={minimizeChat}/>
                    </div>
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