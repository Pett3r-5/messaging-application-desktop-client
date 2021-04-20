import React, { SyntheticEvent, useEffect, useState } from 'react';
import './JoinContainer.css';

interface JoinContainerProps {
    joinConversationByLink: Function
}

function JoinContainer(props: any & JoinContainerProps) {
    const [ linkInput, setLinkInput ] = useState<string>("")

    const handleChange= (event:any)=> {
        setLinkInput(event.currentTarget.value)
      }

      const submitRegistration= (event:SyntheticEvent)=> {
        event.preventDefault()
        props.joinConversationByLink(linkInput)
      }

    return (
        <div className="join-box">
            <span className="typography">Entrar em uma conversa</span>
            <form onSubmit={submitRegistration} style={{ margin: 20 }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                    <label htmlFor="conversationHash">Link: </label>
                </div>
                <div className="form-container">
                    <input className="join-input-field" name="linkInput" value={linkInput} onChange={(e) =>handleChange(e)} id="conversationHash" type="text" />
                    <button className="go-button" type="submit">Ir</button>
                </div>
            </form>
        </div>
    )
}

export default JoinContainer