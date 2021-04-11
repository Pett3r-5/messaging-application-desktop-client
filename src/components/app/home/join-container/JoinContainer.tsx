import React, { useEffect, useState } from 'react';
import './JoinContainer.css';

function JoinContainer() {
    return (
        <div className="join-box">
            <span className="typography">Entrar em uma conversa</span>
            <form style={{ margin: 20 }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                    <label htmlFor="conversationHash">Link: </label>
                </div>
                <div className="form-container">
                    <input className="join-input-field" id="conversationHash" type="text" />
                    <button className="go-button" type="submit">Ir</button>
                </div>
            </form>
        </div>
    )
}

export default JoinContainer