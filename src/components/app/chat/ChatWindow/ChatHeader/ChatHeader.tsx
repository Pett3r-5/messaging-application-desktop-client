import React, { useContext, useState } from 'react';
import Conversation from '../../../../../models/Conversation';
import './ChatHeader.css';
import { mapper } from '../../../../../commons/mapper'
const downArrow = require('../../../../../assets/PinClipart.com_zip-clipart_2015963.png').default
const minimize = require('../../../../../assets/minimize.svg').default
import { OpenedConversationContext } from '../../../App';

interface ChatHeaderProps {
    onHeaderHover: Function
    minimizeConversation: Function
}

function ChatHeader({ onHeaderHover, minimizeConversation }: ChatHeaderProps) {

    const { openedConversation } = useContext(OpenedConversationContext)
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

    if (!!openedConversation) {
        return (
            <div className="chat-header" onMouseOver={handleMouseOver} onMouseLeave={handleMouseOut}>
                <div className="chat-header-content">
                    <div className="chat-first-row-width" style={{marginLeft: 10}}></div>
                    {showContent && !!openedConversation.subject ? 
                    <div className="chat-subject chat-first-row-width" >
                        <p className="chat-subject-paragraph">{openedConversation.subject}</p>
                    </div> 
                    : <></>}
                    <div className="chat-first-row-width" id="minimize-icon-container">
                            <img src={minimize} id="minimize-icon-image" onClick={minimizeChat}/>
                    </div>
                </div>
                <div className="chat-header-content">
                    <div className="chat-link">
                        <div>Link do chat:</div>
                        <div className="chat-link-uuid">{showContent ? openedConversation.conversationLink : ""}</div>
                    </div>
                    {!showContent ? 
                        <div>
                        <img style={{height:10, margin: "auto"}} src={downArrow} />
                        </div>
                    : <div><b>{!!openedConversation.isPublic? "público" : "particular"}</b></div>}
                    
                    <div className="chat-users">
                        { !!openedConversation.users ?
                            openedConversation.users.map((element, index) => (<>
                                {index === openedConversation.users.length - 1 ? element.name : mapper.addComma(element.name)}
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