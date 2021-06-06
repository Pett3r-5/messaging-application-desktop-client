import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import User from '../../../../models/User';
import './UserName.css';
const toolIcon = require('../../../../assets/tool_icon_151041.svg').default
const tickLogo = require('../../../../assets/check_accept_done_tick_icon_143633.svg').default

interface UserNameProps {
    user: User
    editUsername: Function
}

function UserName({ user, editUsername }: UserNameProps) {
    const [nameValue, setNameValue] = useState<string>(user.name)
    const [isInputEnabled, setIsInputEnabled] = useState<boolean>(false)

    const editName = (event:SyntheticEvent)=> {
        event.preventDefault()
        console.log(isInputEnabled)
        setIsInputEnabled(true)
    }

    const handleChange = (event:any)=> {
        setNameValue(event.currentTarget.value)
    }

    const handleSubmit = (event:SyntheticEvent)=>{
        event.preventDefault()
        editUsername({clientId: user.clientId, name: nameValue})
        setIsInputEnabled(false)
    }
  
    return (
        <div>
            {!!isInputEnabled ?
            <form className="welcome-sentence" onSubmit={handleSubmit}>
                <div id="welcome-user">Bem-vindo, 
                <input id="input-name" placeholder={user.name} onChange={handleChange} name="name" value={nameValue} />!
                </div>
                <button type="submit" id="edit-button">
                <img src={tickLogo} id="tool-icon" />
                </button>
            </form>
            : 
            <div style={{margin:25, display:"flex", flexDirection: "row"}}>
                <div id="welcome-user">Bem-vindo, {user.name}! </div>
                <button id="edit-button" onClick={(event)=>editName(event)}>
                    <img src={toolIcon} id="tool-icon" />
                </button>
            </div>}    
        </div>
        )
}

export default UserName