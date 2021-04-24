import React, { SyntheticEvent, useEffect, useState } from 'react';
import ChatCreationForm from '../../../models/ChatCreationForm';
import './ChatOptions.css';

interface ChatOptions {
    createConversation: Function
}

function ChatOptions({ createConversation }: ChatOptions) {
    const [formData, setFormData] = useState<ChatCreationForm>({
        subject: "",
        isPublic: "false",
        persist: "true"
    })

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        createConversation(formData)
    }

    const handleChange = (event: any) => {
        setFormData({ ...formData, [event.currentTarget.name]: event.currentTarget.value })
    }

    const handleSwitch = () => {
        const value:string= formData.isPublic === "true" ? "false" : "true"
        console.log(value)
        setFormData({ ...formData, isPublic: value })
    }

    return (
        <div className="options-modal">
            <form onSubmit={handleSubmit}>
                <div className="form-section" style={{padding: "15px 0px 5px 0px", borderBottom: "solid black 1px"}}>
                   Nova Conversa
                </div>
                <div className="form-section">
                    <label htmlFor="subject">Assunto:</label>
                    <input id="subject" type="text" name="subject" onChange={handleChange} />
                </div>
                <div className="form-section">
                    <div className="form-row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="isPublic">{formData.isPublic === "true" ? "É público " : "É privado "}</label>
                            <label className="switch">
                                <input type="checkbox" checked={formData.isPublic === "false"} onChange={handleSwitch} />
                                <span className="slider round"></span>
                            </label>
                        </div>

                    </div>
                </div>
                <div className="form-section" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="create-form-button" onSubmit={handleSubmit} type="submit">Criar</button>
                </div>
            </form>
        </div>
    )
}

export default ChatOptions