import React, { SyntheticEvent, useContext, useState } from 'react';
import Message from '../../../../../models/Message';
import './MessageForm.css';
const pressButton = require('../../../../../assets/play.png').default
import { UserContext, OpenedConversationContext } from '../../../App';
import Connection from '../../../../../commons/Connection';


function MessageForm() {
    const [message, setMessage] = useState<Message>({
        content: ""
    })

    const { user, setUser } = useContext(UserContext)
    const { openedConversation, setOpenedConversation } = useContext(OpenedConversationContext)

    const handleChange = (event: any) => {
        setMessage({ ...message, [event.currentTarget.name]: event.currentTarget.value })
    }

    const submitRegistration = (event: SyntheticEvent) => {
        event.preventDefault()
        if(user) {
            message.sentBy = {
                name: user.name,
                clientId: user.clientId
            }

            Connection.getSocket().emit("post-message", { conversation: openedConversation, message: message })
            setMessage({ content: "" })
        }
    }

    const submitOnEnter = (event:any)=> {
        if(event.key === 'Enter' && event.shiftKey === false) {
            submitRegistration(event)
          }
    }


    return (
        <div className="external-padding">
            <div className="input-container">
                <form onSubmit={submitRegistration}>
                    <div className="input-box-shadow"></div>
                    <div className="input-box">
                        <textarea id="content" name="content" value={message.content} onChange={(e) => handleChange(e)} onKeyDown={(e)=>submitOnEnter(e)} className="input-v" />
                        <button type="submit" disabled={!message.content} className={!!message.content ? "submit-button" : "submit--button-disabled"}>
                            <img src={pressButton} style={{ height: 30, width: "auto", margin: "auto" }} />
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}


export default MessageForm;